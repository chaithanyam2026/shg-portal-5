import { FINANCIAL_YEAR_STATUS, type FinancialYearStatus } from "./financial-year-status";

export const REVIEW_FINANCIAL_YEAR_STATUSES = [
  FINANCIAL_YEAR_STATUS.VALIDATED,
  FINANCIAL_YEAR_STATUS.APPROVED,
] as const;

export type ReviewFinancialYearStatus = (typeof REVIEW_FINANCIAL_YEAR_STATUSES)[number];

export const OPENING_BALANCE_SOURCE_STATUSES = [
  FINANCIAL_YEAR_STATUS.CLOSED,
  ...REVIEW_FINANCIAL_YEAR_STATUSES,
] as const;

export type OpeningBalanceSourceStatus = (typeof OPENING_BALANCE_SOURCE_STATUSES)[number];

export function isReviewFinancialYearStatus(
  status: FinancialYearStatus,
): status is ReviewFinancialYearStatus {
  return REVIEW_FINANCIAL_YEAR_STATUSES.includes(status as ReviewFinancialYearStatus);
}

export function isOpeningBalanceSourceStatus(
  status: FinancialYearStatus,
): status is OpeningBalanceSourceStatus {
  return OPENING_BALANCE_SOURCE_STATUSES.includes(status as OpeningBalanceSourceStatus);
}
