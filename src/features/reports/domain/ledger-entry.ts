import type { LedgerTransactionType } from "./transaction-type";

export type LedgerEntry = {
  date: Date;

  transactionType: LedgerTransactionType;

  description: string;

  income: number;

  expense: number;

  cashInHand: number;

  bankBalance: number;

  meetingId?: string;

  referenceId?: string;

  /**
   * Shown in the income column without affecting running balances.
   */
  displayIncome?: number;

  /**
   * Hide the cash-in-hand column until opening cash is established.
   */
  cashInHandHidden?: boolean;

  isSummary?: boolean;
};
