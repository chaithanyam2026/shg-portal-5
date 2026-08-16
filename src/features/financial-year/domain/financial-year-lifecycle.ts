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

type FinancialYearCreateCheck = {
  name: string;
  status: FinancialYearStatus;
};

export function canReopenFinancialYear(status: FinancialYearStatus) {
  return status === FINANCIAL_YEAR_STATUS.CLOSED;
}

/**
 * Returns why a new financial year cannot be created, or null when creation is allowed.
 */
export function getFinancialYearCreateBlockReason(
  financialYears: FinancialYearCreateCheck[],
): string | null {
  const draftYear = financialYears.find(
    (financialYear) => financialYear.status === FINANCIAL_YEAR_STATUS.DRAFT,
  );

  if (draftYear) {
    return `A draft financial year "${draftYear.name}" already exists. Start or remove it before creating another year.`;
  }

  const inProgressYear = financialYears.find(
    (financialYear) => financialYear.status === FINANCIAL_YEAR_STATUS.IN_PROGRESS,
  );

  if (inProgressYear) {
    return `Financial year "${inProgressYear.name}" is still in progress. Validate and approve it before creating the next year.`;
  }

  const reviewYears = financialYears.filter((financialYear) =>
    isReviewFinancialYearStatus(financialYear.status),
  );

  if (reviewYears.length > 1) {
    return "Only one financial year can be validated or approved at a time.";
  }

  const invalidYear = financialYears.find(
    (financialYear) =>
      financialYear.status !== FINANCIAL_YEAR_STATUS.CLOSED &&
      !isReviewFinancialYearStatus(financialYear.status),
  );

  if (invalidYear) {
    return `Financial year "${invalidYear.name}" must be closed before creating a new year.`;
  }

  return null;
}
