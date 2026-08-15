import { Types } from "mongoose";

import { get as getFinancialYear } from "@/features/financial-year/services/get";
import { MEETING_STATUS } from "@/features/meetings/domain/meeting-status";
import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import type { IncomeExpenseReport } from "@/features/reports/types";
import Meeting from "@/models/Meeting";

import { buildIncomeExpenseStatement } from "./internal/build-income-expense-statement";
import { buildLoanDisbursementEntries } from "./helpers/build-loan-disbursement-entries";
import { buildBankEntries } from "./helpers/build-bank-entries";
import { buildExpenseEntries } from "./helpers/build-expense-entries";
import { buildFinancialYearOpeningEntries } from "./helpers/build-financial-year-opening-entries";
import { buildIncomeEntries } from "./helpers/build-income-entries";
import {
  buildMeetingIncomeTotalEntry,
  buildPaymentEntries,
} from "./helpers/build-payment-entries";
import { calculateRunningBalances } from "./helpers/calculate-running-balances";
import { groupMonthlyLedger } from "./helpers/group-monthly-ledger";
import { sortLedgerEntries } from "./helpers/sort-ledger-entries";

export async function buildIncomeExpenseReport(
  financialYearId: string,
): Promise<IncomeExpenseReport> {
  const financialYear = await getFinancialYear(financialYearId);

  const meetings = await Meeting.find({
    financialYearId: new Types.ObjectId(financialYearId),
    status: MEETING_STATUS.CLOSED,
  })
    .sort({
      meetingDate: 1,
    })
    .lean()
    .exec();

  const ledgerEntries: LedgerEntry[] = [
    ...buildFinancialYearOpeningEntries({
      financialYearId: financialYear._id,
      startDate: financialYear.startDate,
      openingBalances: financialYear.openingBalances,
      members: financialYear.members,
    }),
  ];

  for (const meeting of meetings) {
    const paymentEntries = buildPaymentEntries({
      _id: meeting._id.toString(),
      meetingDate: meeting.meetingDate,
      payments: meeting.payments.map((payment) => ({
        memberId: payment.memberId.toString(),
        contribution: payment.contribution,
        loanRepayment: payment.loanRepayment,
        absentFine: payment.absentFine,
        specialLoanFine: payment.specialLoanFine,
      })),
    });

    const incomeEntries = buildIncomeEntries({
      _id: meeting._id.toString(),
      otherIncomes: meeting.otherIncomes.map((income) => ({
        transactionDate: income.transactionDate,
        category: income.category,
        amount: income.amount,
        remarks: income.remarks,
      })),
    });

    const meetingIncomeTotal = [...paymentEntries, ...incomeEntries].reduce(
      (total, entry) => total + entry.income,
      0,
    );

    const meetingIncomeTotalEntry = buildMeetingIncomeTotalEntry(
      meeting._id.toString(),
      meeting.meetingDate,
      meetingIncomeTotal,
    );

    ledgerEntries.push(...paymentEntries, ...incomeEntries);

    if (meetingIncomeTotalEntry) {
      ledgerEntries.push(meetingIncomeTotalEntry);
    }

    ledgerEntries.push(
      ...buildExpenseEntries({
        _id: meeting._id.toString(),
        meetingDate: meeting.meetingDate,
        expenses: (meeting.expenses ?? []).map((expense) => ({
          transactionDate: expense.transactionDate,
          category: expense.category,
          amount: expense.amount,
          remarks: expense.remarks,
        })),
      }),
    );

    ledgerEntries.push(
      ...buildBankEntries({
        _id: meeting._id.toString(),
        bankTransactions: (meeting.bankTransactions ?? []).map((transaction) => ({
          transactionDate: transaction.transactionDate,
          type: transaction.type,
          amount: transaction.amount,
          remarks: transaction.remarks,
        })),
      }),
    );
  }

  const closedMeetingIds = new Set(meetings.map((meeting) => meeting._id.toString()));

  ledgerEntries.push(
    ...(await buildLoanDisbursementEntries({
      financialYearId,
      closedMeetingIds,
    })),
  );

  const sortedEntries = sortLedgerEntries(ledgerEntries);

  const openingBalance = {
    cashInHand: financialYear.openingBalances.cashInHand,
    bankBalance: financialYear.openingBalances.bankBalance,
  };

  const closingBalance = calculateRunningBalances(
    sortedEntries,
    0,
    openingBalance.bankBalance,
  );

  const months = groupMonthlyLedger(sortedEntries);

  const statement = await buildIncomeExpenseStatement(
    financialYearId,
    meetings,
    financialYear.openingBalances,
    financialYear.startDate,
    financialYear.members,
  );

  return {
    financialYearId,

    statement,

    openingBalance,

    closingBalance,

    totalIncome: statement.income.total,

    totalExpense: statement.expense.total,

    months,
  };
}
