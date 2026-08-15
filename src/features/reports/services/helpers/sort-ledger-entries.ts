import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";

const TRANSACTION_ORDER: Record<string, number> = {
  [LEDGER_TRANSACTION_TYPE.OPENING_CONTRIBUTION]: 0,
  [LEDGER_TRANSACTION_TYPE.OPENING_LOAN]: 1,
  [LEDGER_TRANSACTION_TYPE.OPENING_SPECIAL_LOAN]: 2,
  [LEDGER_TRANSACTION_TYPE.OPENING_EXCESS_CORPUS]: 3,
  [LEDGER_TRANSACTION_TYPE.OPENING_BANK_BALANCE]: 4,
  [LEDGER_TRANSACTION_TYPE.OPENING_INVESTMENTS]: 5,
  [LEDGER_TRANSACTION_TYPE.OPENING_CASH_IN_HAND]: 6,
  [LEDGER_TRANSACTION_TYPE.CONTRIBUTION]: 7,
  [LEDGER_TRANSACTION_TYPE.LOAN_REPAYMENT]: 8,
  [LEDGER_TRANSACTION_TYPE.ABSENT_FINE]: 9,
  [LEDGER_TRANSACTION_TYPE.SPECIAL_LOAN_FINE]: 10,
  [LEDGER_TRANSACTION_TYPE.OTHER_INCOME]: 11,
  [LEDGER_TRANSACTION_TYPE.MEETING_INCOME_TOTAL]: 12,
  [LEDGER_TRANSACTION_TYPE.BANK_INTEREST]: 13,
  [LEDGER_TRANSACTION_TYPE.BANK_INVESTMENT_MATURITY]: 14,
  [LEDGER_TRANSACTION_TYPE.BANK_WITHDRAWAL]: 15,
  [LEDGER_TRANSACTION_TYPE.BANK_DEPOSIT]: 16,
  [LEDGER_TRANSACTION_TYPE.BANK_INVESTMENT]: 17,
  [LEDGER_TRANSACTION_TYPE.BANK_CHARGE]: 18,
  [LEDGER_TRANSACTION_TYPE.OTHER_EXPENSE]: 19,
  [LEDGER_TRANSACTION_TYPE.LOAN_DISBURSEMENT]: 20,
};

export function sortLedgerEntries(entries: LedgerEntry[]): LedgerEntry[] {
  return [...entries].sort((a, b) => {
    const dateComparison = a.date.getTime() - b.date.getTime();

    if (dateComparison !== 0) {
      return dateComparison;
    }

    const typeComparison =
      TRANSACTION_ORDER[a.transactionType] - TRANSACTION_ORDER[b.transactionType];

    if (typeComparison !== 0) {
      return typeComparison;
    }

    return a.description.localeCompare(b.description);
  });
}
