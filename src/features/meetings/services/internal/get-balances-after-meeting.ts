import { Types } from "mongoose";

import { get as getFinancialYear } from "@/features/financial-year/services/get";
import { buildBankEntries } from "@/features/reports/services/helpers/build-bank-entries";
import { buildExpenseEntries } from "@/features/reports/services/helpers/build-expense-entries";
import { buildFinancialYearOpeningEntries } from "@/features/reports/services/helpers/build-financial-year-opening-entries";
import { buildIncomeEntries } from "@/features/reports/services/helpers/build-income-entries";
import { buildLoanDisbursementEntries } from "@/features/reports/services/helpers/build-loan-disbursement-entries";
import {
  buildMeetingIncomeTotalEntry,
  buildPaymentEntries,
} from "@/features/reports/services/helpers/build-payment-entries";
import { calculateRunningBalances } from "@/features/reports/services/helpers/calculate-running-balances";
import { sortLedgerEntries } from "@/features/reports/services/helpers/sort-ledger-entries";
import { compareCalendarDates } from "@/lib/utils/date";
import Meeting from "@/models/Meeting";

import { MEETING_STATUS } from "../../domain/meeting-status";

export type MeetingAccountBalances = {
  cashInHand: number;
  bankBalance: number;
};

function isUpToCurrentMeeting(
  meetingDate: Date,
  meetingId: string,
  currentDate: Date,
  currentId: string,
): boolean {
  if (meetingId === currentId) {
    return true;
  }

  const dateDiff = meetingDate.getTime() - currentDate.getTime();

  if (dateDiff < 0) {
    return true;
  }

  if (dateDiff > 0) {
    return false;
  }

  return meetingId < currentId;
}

export async function getBalancesAfterMeeting(
  financialYearId: string,
  meetingId: string,
  meetingDate: Date,
): Promise<MeetingAccountBalances> {
  const financialYear = await getFinancialYear(financialYearId);

  const meetings = await Meeting.find({
    financialYearId: new Types.ObjectId(financialYearId),
    status: MEETING_STATUS.CLOSED,
  })
    .sort({ meetingDate: 1 })
    .lean()
    .exec();

  const included = meetings.filter((meeting) =>
    isUpToCurrentMeeting(meeting.meetingDate, meeting._id.toString(), meetingDate, meetingId),
  );

  const ledgerEntries = [
    ...buildFinancialYearOpeningEntries({
      financialYearId: financialYear._id,
      startDate: new Date(financialYear.startDate),
      openingBalances: financialYear.openingBalances,
      members: financialYear.members.map((member) => ({
        opening: member.opening,
      })),
    }),
  ];

  for (const meeting of included) {
    const meetingRecord = {
      _id: meeting._id.toString(),
      meetingDate: meeting.meetingDate,
      payments: meeting.payments.map((payment) => ({
        memberId: payment.memberId.toString(),
        contribution: payment.contribution,
        loanRepayment: payment.loanRepayment,
        absentFine: payment.absentFine,
        specialLoanFine: payment.specialLoanFine,
      })),
      otherIncomes: meeting.otherIncomes.map((income) => ({
        transactionDate: income.transactionDate,
        category: income.category,
        amount: income.amount,
        remarks: income.remarks,
      })),
      expenses: (meeting.expenses ?? []).map((expense) => ({
        transactionDate: expense.transactionDate,
        category: expense.category,
        amount: expense.amount,
        remarks: expense.remarks,
      })),
      bankTransactions: (meeting.bankTransactions ?? []).map((transaction) => ({
        transactionDate: transaction.transactionDate,
        type: transaction.type,
        amount: transaction.amount,
        remarks: transaction.remarks,
      })),
    };

    const paymentEntries = buildPaymentEntries(meetingRecord);
    const incomeEntries = buildIncomeEntries(meetingRecord);
    const meetingIncomeTotal = [...paymentEntries, ...incomeEntries].reduce(
      (total, entry) => total + entry.income,
      0,
    );
    const meetingIncomeTotalEntry = buildMeetingIncomeTotalEntry(
      meetingRecord._id,
      meetingRecord.meetingDate,
      meetingIncomeTotal,
    );

    ledgerEntries.push(...paymentEntries, ...incomeEntries);

    if (meetingIncomeTotalEntry) {
      ledgerEntries.push(meetingIncomeTotalEntry);
    }

    ledgerEntries.push(...buildExpenseEntries(meetingRecord));
    ledgerEntries.push(...buildBankEntries(meetingRecord));
  }

  const closedMeetingIds = new Set(included.map((meeting) => meeting._id.toString()));
  const loanEntries = await buildLoanDisbursementEntries({
    financialYearId,
    closedMeetingIds,
  });

  ledgerEntries.push(
    ...loanEntries.filter((entry) => {
      if (entry.meetingId) {
        return closedMeetingIds.has(entry.meetingId);
      }

      return compareCalendarDates(entry.date, meetingDate) <= 0;
    }),
  );

  const sortedEntries = sortLedgerEntries(ledgerEntries);
  const closingBalance = calculateRunningBalances(
    sortedEntries,
    0,
    financialYear.openingBalances.bankBalance,
  );

  return closingBalance;
}
