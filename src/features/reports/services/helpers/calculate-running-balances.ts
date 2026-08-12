import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";
import type { RunningBalance } from "@/features/reports/types";

export function calculateRunningBalances(
  entries: LedgerEntry[],
  openingCash: number,
  openingBank: number,
): RunningBalance {
  let cashInHand = openingCash;
  let bankBalance = openingBank;

  for (const entry of entries) {
    if (entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_DEPOSIT) {
      cashInHand -= entry.expense;
      bankBalance += entry.expense;
    } else if (entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_WITHDRAWAL) {
      bankBalance -= entry.income;
      cashInHand += entry.income;
    } else {
      cashInHand += entry.income;
      cashInHand -= entry.expense;
    }

    entry.cashInHand = cashInHand;
    entry.bankBalance = bankBalance;
  }

  return {
    cashInHand,
    bankBalance,
  };
}
