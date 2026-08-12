import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";

const TRANSACTION_ORDER: Record<string, number> = {
  [LEDGER_TRANSACTION_TYPE.CONTRIBUTION]: 1,
  [LEDGER_TRANSACTION_TYPE.LOAN_REPAYMENT]: 2,
  [LEDGER_TRANSACTION_TYPE.ABSENT_FINE]: 3,
  [LEDGER_TRANSACTION_TYPE.SPECIAL_LOAN_FINE]: 4,
  [LEDGER_TRANSACTION_TYPE.OTHER_INCOME]: 5,
  [LEDGER_TRANSACTION_TYPE.BANK_WITHDRAWAL]: 6,
  [LEDGER_TRANSACTION_TYPE.BANK_DEPOSIT]: 7,
  [LEDGER_TRANSACTION_TYPE.OTHER_EXPENSE]: 8,
  [LEDGER_TRANSACTION_TYPE.LOAN_DISBURSEMENT]: 9,
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
