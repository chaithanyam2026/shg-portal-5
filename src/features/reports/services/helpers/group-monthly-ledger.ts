import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import {
  LEDGER_TRANSACTION_TYPE,
} from "@/features/reports/domain/transaction-type";
import type {
  MonthlyLedger,
} from "@/features/reports/types";

export function groupMonthlyLedger(
  entries: LedgerEntry[],
): MonthlyLedger[] {
  const months = new Map<string, MonthlyLedger>();

  for (const entry of entries) {
    const year = entry.date.getFullYear();
    const month = entry.date.getMonth();

    const key = `${year}-${String(month + 1).padStart(2, "0")}`;

    let ledger = months.get(key);

    if (!ledger) {
      const openingCash =
        entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_DEPOSIT
          ? entry.cashInHand + entry.expense
          : entry.transactionType ===
              LEDGER_TRANSACTION_TYPE.BANK_WITHDRAWAL
            ? entry.cashInHand - entry.income
            : entry.cashInHand - entry.income + entry.expense;

      const openingBank =
        entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_DEPOSIT
          ? entry.bankBalance - entry.expense
          : entry.transactionType ===
              LEDGER_TRANSACTION_TYPE.BANK_WITHDRAWAL
            ? entry.bankBalance + entry.income
            : entry.bankBalance;

      ledger = {
        month: entry.date.toLocaleString("default", {
          month: "long",
        }),
        year,

        openingBalance: {
          cashInHand: openingCash,
          bankBalance: openingBank,
        },

        closingBalance: {
          cashInHand: entry.cashInHand,
          bankBalance: entry.bankBalance,
        },

        totalIncome: 0,
        totalExpense: 0,

        entries: [],
      };

      months.set(key, ledger);
    }

    ledger.entries.push(entry);

    ledger.totalIncome += entry.income;
    ledger.totalExpense += entry.expense;

    ledger.closingBalance = {
      cashInHand: entry.cashInHand,
      bankBalance: entry.bankBalance,
    };
  }

  return [...months.values()];
}