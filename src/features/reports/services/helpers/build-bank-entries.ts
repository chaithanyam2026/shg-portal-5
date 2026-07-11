import {
  BANK_TRANSACTION_TYPE,
} from "@/features/meetings/domain/bank-transaction";
import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";

type MeetingBankTransactions = {
  _id: string;
  bankTransactions: {
    transactionDate: Date;
    type: string;
    amount: number;
    remarks: string;
  }[];
};

export function buildBankEntries(
  meeting: MeetingBankTransactions,
): LedgerEntry[] {
  return meeting.bankTransactions.flatMap((transaction) => {
    if (transaction.amount <= 0) {
      return [];
    }

    if (transaction.type === BANK_TRANSACTION_TYPE.DEPOSIT) {
      return [
        {
          date: transaction.transactionDate,
          transactionType: LEDGER_TRANSACTION_TYPE.BANK_DEPOSIT,
          description: "Bank Deposit",
          income: 0,
          expense: transaction.amount,
          cashInHand: 0,
          bankBalance: 0,
          meetingId: meeting._id,
        },
      ];
    }

    if (transaction.type === BANK_TRANSACTION_TYPE.WITHDRAWAL) {
      return [
        {
          date: transaction.transactionDate,
          transactionType: LEDGER_TRANSACTION_TYPE.BANK_WITHDRAWAL,
          description: "Bank Withdrawal",
          income: transaction.amount,
          expense: 0,
          cashInHand: 0,
          bankBalance: 0,
          meetingId: meeting._id,
        },
      ];
    }

    return [];
  });
}