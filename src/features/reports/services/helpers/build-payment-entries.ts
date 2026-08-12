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

export function buildPaymentEntries(meeting: MeetingPayments): LedgerEntry[] {
  return meeting.payments.flatMap((payment) => {
    const entries: LedgerEntry[] = [];

    if (payment.contribution > 0) {
      entries.push({
        date: meeting.meetingDate,
        transactionType: LEDGER_TRANSACTION_TYPE.CONTRIBUTION,
        description: "Weekly Contribution",
        income: payment.contribution,
        expense: 0,
        cashInHand: 0,
        bankBalance: 0,
        meetingId: meeting._id,
        referenceId: payment.memberId,
      });
    }

    if (payment.loanRepayment > 0) {
      entries.push({
        date: meeting.meetingDate,
        transactionType: LEDGER_TRANSACTION_TYPE.LOAN_REPAYMENT,
        description: "Loan Repayment",
        income: payment.loanRepayment,
        expense: 0,
        cashInHand: 0,
        bankBalance: 0,
        meetingId: meeting._id,
        referenceId: payment.memberId,
      });
    }

    if (payment.absentFine > 0) {
      entries.push({
        date: meeting.meetingDate,
        transactionType: LEDGER_TRANSACTION_TYPE.ABSENT_FINE,
        description: "Absent Fine",
        income: payment.absentFine,
        expense: 0,
        cashInHand: 0,
        bankBalance: 0,
        meetingId: meeting._id,
        referenceId: payment.memberId,
      });
    }

    if (payment.specialLoanFine > 0) {
      entries.push({
        date: meeting.meetingDate,
        transactionType: LEDGER_TRANSACTION_TYPE.SPECIAL_LOAN_FINE,
        description: "Special Loan Fine",
        income: payment.specialLoanFine,
        expense: 0,
        cashInHand: 0,
        bankBalance: 0,
        meetingId: meeting._id,
        referenceId: payment.memberId,
      });
    }

    return entries;
  });
}
