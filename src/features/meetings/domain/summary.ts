export type ValidationSeverity =
  | "SUCCESS"
  | "WARNING"
  | "ERROR";

export const VALIDATION_SEVERITY = {
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  ERROR: "ERROR",
} as const;

export const VALIDATION_CODE = {
  ATTENDANCE: "ATTENDANCE",
  PAYMENTS: "PAYMENTS",
  BANK: "BANK",
  INCOME: "INCOME",
  EXPENSES: "EXPENSES",
  BALANCE: "BALANCE",
  READY_TO_CLOSE: "READY_TO_CLOSE",
} as const;

export type ValidationCode =
  (typeof VALIDATION_CODE)[keyof typeof VALIDATION_CODE];