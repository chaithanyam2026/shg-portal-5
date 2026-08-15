import type { IncomeExpenseStatement } from "./domain/income-expense-statement";
import type { LedgerEntry } from "./domain/ledger-entry";

export type RunningBalance = {
  cashInHand: number;
  bankBalance: number;
};

export type MonthlyLedger = {
  month: string;
  year: number;
  openingBalance: RunningBalance;
  closingBalance: RunningBalance;
  totalIncome: number;
  totalExpense: number;
  entries: LedgerEntry[];
};

export type IncomeExpenseReport = {
  financialYearId: string;

  statement: IncomeExpenseStatement;

  openingBalance: RunningBalance;

  closingBalance: RunningBalance;

  totalIncome: number;

  totalExpense: number;

  months: MonthlyLedger[];
};
