import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import {
  isOpeningAccountLedgerEntry,
  isOpeningMemberLedgerEntry,
  LEDGER_TRANSACTION_TYPE,
} from "@/features/reports/domain/transaction-type";
import type { MonthlyLedger } from "@/features/reports/types";

function getMonthOpeningBalance(entry: LedgerEntry): {
  cashInHand: number;
  bankBalance: number;
} {
  if (isOpeningAccountLedgerEntry(entry.transactionType)) {
    return {
      cashInHand: entry.cashInHandHidden ? 0 : entry.cashInHand,
      bankBalance: entry.bankBalance,
    };
  }

  if (isOpeningMemberLedgerEntry(entry.transactionType)) {
    return {
      cashInHand: entry.cashInHandHidden ? 0 : entry.cashInHand,
      bankBalance: entry.bankBalance,
    };
  }

  if (entry.transactionType === LEDGER_TRANSACTION_TYPE.OPENING_CASH_IN_HAND) {
    return {
      cashInHand: 0,
      bankBalance: entry.bankBalance,
    };
  }

  if (entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_DEPOSIT) {
    return {
      cashInHand: entry.cashInHand + entry.expense,
      bankBalance: entry.bankBalance - entry.expense,
    };
  }

  if (entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_WITHDRAWAL) {
    return {
      cashInHand: entry.cashInHand - entry.income,
      bankBalance: entry.bankBalance + entry.income,
    };
  }

  if (
    entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_INTEREST ||
    entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_INVESTMENT_MATURITY
  ) {
    return {
      cashInHand: entry.cashInHand,
      bankBalance: entry.bankBalance - entry.income,
    };
  }

  if (
    entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_INVESTMENT ||
    entry.transactionType === LEDGER_TRANSACTION_TYPE.BANK_CHARGE
  ) {
    return {
      cashInHand: entry.cashInHand,
      bankBalance: entry.bankBalance + entry.expense,
    };
  }

  return {
    cashInHand: entry.cashInHand - entry.income + entry.expense,
    bankBalance: entry.bankBalance,
  };
}

export function groupMonthlyLedger(entries: LedgerEntry[]): MonthlyLedger[] {
  const months = new Map<string, MonthlyLedger>();

  for (const entry of entries) {
    const year = entry.date.getFullYear();
    const month = entry.date.getMonth();

    const key = `${year}-${String(month + 1).padStart(2, "0")}`;

    let ledger = months.get(key);

    if (!ledger) {
      const { cashInHand: openingCash, bankBalance: openingBank } = getMonthOpeningBalance(entry);

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
