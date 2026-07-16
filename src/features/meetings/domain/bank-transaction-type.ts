/**
 * Bank transaction types.
 */
export const BANK_TRANSACTION_TYPES =
  [
    "DEPOSIT",
    "WITHDRAWAL",
  ] as const;

export type BankTransactionType =
  (typeof BANK_TRANSACTION_TYPES)[number];