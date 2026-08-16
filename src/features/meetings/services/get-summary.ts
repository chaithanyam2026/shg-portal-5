import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import { BANK_TRANSACTION_TYPE } from "../domain/bank-transaction";
import { normalizeAttendanceStatus } from "../domain/attendance-status";
import { getMeetingCloseValidations } from "../domain/meeting-close";
import { VALIDATION_SEVERITY } from "../domain/summary";
import type { MeetingDashboardSummary } from "../types";
import { loadFinancialYearMembers } from "./internal/load-financial-year-members";

export async function getSummary(meetingId: string): Promise<MeetingDashboardSummary> {
  await connectMongo();

  const meeting = await Meeting.findById(meetingId).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const attendance = meeting.attendance ?? [];

  const payments = meeting.payments ?? [];

  const bankTransactions = meeting.bankTransactions ?? [];

  const otherIncomes = meeting.otherIncomes ?? [];

  const expenses = meeting.expenses ?? [];

  const attendanceSummary = {
    totalMembers: attendance.length,

    present: attendance.filter((x) => normalizeAttendanceStatus(x.status) === "PRESENT").length,

    absent: attendance.filter((x) => normalizeAttendanceStatus(x.status) === "ABSENT").length,

    leave: attendance.filter((x) => normalizeAttendanceStatus(x.status) === "LEAVE").length,
  };

  const paymentSummary = {
    contribution: payments.reduce((s, p) => s + p.contribution, 0),

    loanRepayment: payments.reduce((s, p) => s + p.loanRepayment, 0),

    absentFine: payments.reduce((s, p) => s + p.absentFine, 0),

    specialLoanFine: payments.reduce((s, p) => s + p.specialLoanFine, 0),
  };

  const totalCollection =
    paymentSummary.contribution +
    paymentSummary.loanRepayment +
    paymentSummary.absentFine +
    paymentSummary.specialLoanFine;

  const bankDeposits = bankTransactions
    .filter((x) =>
      x.type === BANK_TRANSACTION_TYPE.DEPOSIT ||
      x.type === BANK_TRANSACTION_TYPE.INTEREST ||
      x.type === BANK_TRANSACTION_TYPE.INVESTMENT_MATURITY,
    )
    .reduce((s, x) => s + x.amount, 0);

  const bankWithdrawals = bankTransactions
    .filter((x) =>
      x.type === BANK_TRANSACTION_TYPE.WITHDRAWAL ||
      x.type === BANK_TRANSACTION_TYPE.INVESTMENT ||
      x.type === BANK_TRANSACTION_TYPE.BANK_CHARGE,
    )
    .reduce((s, x) => s + x.amount, 0);

  const totalIncome = otherIncomes.reduce((s, x) => s + x.amount, 0);

  const totalExpense = expenses.reduce((s, x) => s + x.amount, 0);

  const members = await loadFinancialYearMembers(meeting.financialYearId.toString());

  const validations = getMeetingCloseValidations({
    expectedMemberCount: members.length,
    attendanceCount: attendance.length,
    paymentCount: payments.length,
  });

  const canClose = validations.every(
    (validation) => validation.severity !== VALIDATION_SEVERITY.ERROR,
  );

  return {
    meetingId: meeting._id.toString(),

    status: meeting.status,

    meetingDate: meeting.meetingDate.toISOString(),

    place: meeting.place,

    startedAt: meeting.startedAt ? meeting.startedAt.toISOString() : null,

    attendance: attendanceSummary,

    payments: {
      ...paymentSummary,
      totalCollection,
    },

    bank: {
      meetingId: meeting._id.toString(),

      status: meeting.status,

      records: bankTransactions.map((x) => ({
        transactionDate: x.transactionDate.toISOString(),
        type: x.type,
        amount: x.amount,
        remarks: x.remarks,
      })),

      totalDeposits: bankDeposits,

      totalWithdrawals: bankWithdrawals,

      netAmount: bankDeposits - bankWithdrawals,
    },

    income: {
      meetingId: meeting._id.toString(),

      status: meeting.status,

      records: otherIncomes.map((x) => ({
        transactionDate: x.transactionDate.toISOString(),
        category: x.category,
        amount: x.amount,
        remarks: x.remarks,
      })),

      totalIncome,
    },

    expenses: {
      meetingId: meeting._id.toString(),

      status: meeting.status,

      records: expenses.map((x) => ({
        transactionDate: x.transactionDate.toISOString(),
        category: x.category,
        amount: x.amount,
        remarks: x.remarks,
      })),

      totalExpense,
    },

    financial: {
      memberCollection: totalCollection,

      otherIncome: totalIncome,

      expenses: totalExpense,

      netMeetingCollection: totalCollection + totalIncome - totalExpense,

      bankDeposits,

      bankWithdrawals,

      netBankMovement: bankDeposits - bankWithdrawals,
    },

    validations,

    canClose,
  };
}
