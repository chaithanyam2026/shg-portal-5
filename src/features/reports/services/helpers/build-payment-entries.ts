import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";

type MeetingPayments = {
  _id: string;
  meetingDate: Date;
  payments: {
    memberId: string;
    contribution: number;
    loanRepayment: number;
    absentFine: number;
    specialLoanFine: number;
  }[];
};

function sumPayments(meeting: MeetingPayments) {
  return meeting.payments.reduce(
    (totals, payment) => ({
      contribution: totals.contribution + payment.contribution,
      loanRepayment: totals.loanRepayment + payment.loanRepayment,
      absentFine: totals.absentFine + payment.absentFine,
      specialLoanFine: totals.specialLoanFine + payment.specialLoanFine,
    }),
    {
      contribution: 0,
      loanRepayment: 0,
      absentFine: 0,
      specialLoanFine: 0,
    },
  );
}

export function buildPaymentEntries(meeting: MeetingPayments): LedgerEntry[] {
  const totals = sumPayments(meeting);
  const entries: LedgerEntry[] = [];

  if (totals.contribution > 0) {
    entries.push({
      date: meeting.meetingDate,
      transactionType: LEDGER_TRANSACTION_TYPE.CONTRIBUTION,
      description: "Weekly Contribution",
      income: totals.contribution,
      expense: 0,
      cashInHand: 0,
      bankBalance: 0,
      meetingId: meeting._id,
    });
  }

  if (totals.loanRepayment > 0) {
    entries.push({
      date: meeting.meetingDate,
      transactionType: LEDGER_TRANSACTION_TYPE.LOAN_REPAYMENT,
      description: "Loan Repayment",
      income: totals.loanRepayment,
      expense: 0,
      cashInHand: 0,
      bankBalance: 0,
      meetingId: meeting._id,
    });
  }

  if (totals.absentFine > 0) {
    entries.push({
      date: meeting.meetingDate,
      transactionType: LEDGER_TRANSACTION_TYPE.ABSENT_FINE,
      description: "Absent Fine",
      income: totals.absentFine,
      expense: 0,
      cashInHand: 0,
      bankBalance: 0,
      meetingId: meeting._id,
    });
  }

  if (totals.specialLoanFine > 0) {
    entries.push({
      date: meeting.meetingDate,
      transactionType: LEDGER_TRANSACTION_TYPE.SPECIAL_LOAN_FINE,
      description: "Special Loan Fine",
      income: totals.specialLoanFine,
      expense: 0,
      cashInHand: 0,
      bankBalance: 0,
      meetingId: meeting._id,
    });
  }

  return entries;
}

export function buildMeetingIncomeTotalEntry(
  meetingId: string,
  meetingDate: Date,
  meetingIncome: number,
): LedgerEntry | null {
  if (meetingIncome <= 0) {
    return null;
  }

  return {
    date: meetingDate,
    transactionType: LEDGER_TRANSACTION_TYPE.MEETING_INCOME_TOTAL,
    description: "Total Meeting Income",
    income: 0,
    displayIncome: meetingIncome,
    isSummary: true,
    expense: 0,
    cashInHand: 0,
    bankBalance: 0,
    meetingId,
  };
}
