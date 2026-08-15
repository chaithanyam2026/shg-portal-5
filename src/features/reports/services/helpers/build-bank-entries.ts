import {
  BANK_TRANSACTION_TYPE,
  BANK_TRANSACTION_TYPE_OPTIONS,
} from "@/features/meetings/domain/bank-transaction";
import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import {
  LEDGER_TRANSACTION_TYPE,
  type LedgerTransactionType,
} from "@/features/reports/domain/transaction-type";
import { toCalendarDate } from "@/lib/utils/date";

type MeetingBankTransactions = {
  _id: string;
  bankTransactions: {
    transactionDate: Date;
    type: string;
    amount: number;
    remarks: string;
  }[];
};

function getBankTransactionLabel(type: string): string {
  return BANK_TRANSACTION_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

function describeBankTransaction(type: string, remarks: string): string {
  const label = getBankTransactionLabel(type);

  return remarks.trim() ? `${label} — ${remarks.trim()}` : label;
}

function createEntry(
  meetingId: string,
  date: Date,
  type: string,
  remarks: string,
  transactionType: LedgerTransactionType,
  income: number,
  expense: number,
): LedgerEntry {
  return {
    date,
    transactionType,
    description: describeBankTransaction(type, remarks),
    income,
    expense,
    cashInHand: 0,
    bankBalance: 0,
    meetingId,
  };
}

export function buildBankEntries(meeting: MeetingBankTransactions): LedgerEntry[] {
  return (meeting.bankTransactions ?? []).flatMap((transaction): LedgerEntry[] => {
    if (transaction.amount <= 0) {
      return [];
    }

    const date = toCalendarDate(transaction.transactionDate);
    const remarks = transaction.remarks ?? "";
    const amount = transaction.amount;

    switch (transaction.type) {
      case BANK_TRANSACTION_TYPE.DEPOSIT:
        return [
          createEntry(
            meeting._id,
            date,
            transaction.type,
            remarks,
            LEDGER_TRANSACTION_TYPE.BANK_DEPOSIT,
            0,
            amount,
          ),
        ];

      case BANK_TRANSACTION_TYPE.WITHDRAWAL:
        return [
          createEntry(
            meeting._id,
            date,
            transaction.type,
            remarks,
            LEDGER_TRANSACTION_TYPE.BANK_WITHDRAWAL,
            amount,
            0,
          ),
        ];

      case BANK_TRANSACTION_TYPE.INTEREST:
        return [
          createEntry(
            meeting._id,
            date,
            transaction.type,
            remarks,
            LEDGER_TRANSACTION_TYPE.BANK_INTEREST,
            amount,
            0,
          ),
        ];

      case BANK_TRANSACTION_TYPE.INVESTMENT_MATURITY:
        return [
          createEntry(
            meeting._id,
            date,
            transaction.type,
            remarks,
            LEDGER_TRANSACTION_TYPE.BANK_INVESTMENT_MATURITY,
            amount,
            0,
          ),
        ];

      case BANK_TRANSACTION_TYPE.INVESTMENT:
        return [
          createEntry(
            meeting._id,
            date,
            transaction.type,
            remarks,
            LEDGER_TRANSACTION_TYPE.BANK_INVESTMENT,
            0,
            amount,
          ),
        ];

      case BANK_TRANSACTION_TYPE.BANK_CHARGE:
        return [
          createEntry(
            meeting._id,
            date,
            transaction.type,
            remarks,
            LEDGER_TRANSACTION_TYPE.BANK_CHARGE,
            0,
            amount,
          ),
        ];

      default:
        return [];
    }
  });
}
