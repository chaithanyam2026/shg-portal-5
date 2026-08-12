import type { BankTransactionType } from "./bank-transaction-type";

export type MeetingBankTransaction = {
  transactionType: BankTransactionType;

  amount: number;

  remarks?: string;
};
