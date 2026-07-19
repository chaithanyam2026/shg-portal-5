export const FINANCIAL_YEAR_STATUS = {
  DRAFT: "DRAFT",
  IN_PROGRESS: "IN_PROGRESS",
  VALIDATED: "VALIDATED",
  APPROVED: "APPROVED",
  CLOSED: "CLOSED",
} as const;

export type FinancialYearStatus =
  (typeof FINANCIAL_YEAR_STATUS)[keyof typeof FINANCIAL_YEAR_STATUS];

export const FINANCIAL_YEAR_STATUS_VALUES = Object.values(
  FINANCIAL_YEAR_STATUS,
) as FinancialYearStatus[];

export function isFinancialYearStatus(value: unknown): value is FinancialYearStatus {
  return (
    typeof value === "string" && FINANCIAL_YEAR_STATUS_VALUES.includes(value as FinancialYearStatus)
  );
}
