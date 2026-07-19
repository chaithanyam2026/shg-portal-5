/**
 * Payment types supported
 * during a meeting.
 */
export const PAYMENT_TYPES = [
  "SAVINGS",
  "LOAN_REPAYMENT",
  "LOAN_INTEREST",
  "LOAN_FINE",
  "ABSENT_FINE",
  "OTHER_INCOME",
  "OTHER",
] as const;

/**
 * Meeting payment type.
 */
export type PaymentType = (typeof PAYMENT_TYPES)[number];
