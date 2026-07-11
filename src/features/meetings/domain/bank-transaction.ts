export const BANK_TRANSACTION_TYPE = {
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
  INVESTMENT: "INVESTMENT",
  INVESTMENT_MATURITY:
    "INVESTMENT_MATURITY",
  INTEREST: "INTEREST",
  BANK_CHARGE: "BANK_CHARGE",
} as const;

export const BANK_TRANSACTION_TYPE_VALUES =
  Object.values(
    BANK_TRANSACTION_TYPE,
  );

export type BankTransactionType =
  (typeof BANK_TRANSACTION_TYPE_VALUES)[number];

export const BANK_TRANSACTION_TYPE_OPTIONS =
  [
    {
      value:
        BANK_TRANSACTION_TYPE.DEPOSIT,
      label: "Deposit",
    },
    {
      value:
        BANK_TRANSACTION_TYPE.WITHDRAWAL,
      label: "Withdrawal",
    },
    {
      value:
        BANK_TRANSACTION_TYPE.INVESTMENT,
      label: "Investment",
    },
    {
      value:
        BANK_TRANSACTION_TYPE.INVESTMENT_MATURITY,
      label:
        "Investment Maturity",
    },
    {
      value:
        BANK_TRANSACTION_TYPE.INTEREST,
      label: "Interest",
    },
    {
      value:
        BANK_TRANSACTION_TYPE.BANK_CHARGE,
      label: "Bank Charge",
    },
  ] as const;