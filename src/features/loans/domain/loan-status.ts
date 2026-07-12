/**
 * Individual loan status constants.
 */
export const ACTIVE_LOAN_STATUS =
  "ACTIVE";

export const CLOSED_LOAN_STATUS =
  "CLOSED";

/**
 * Loan status list.
 *
 * New preferred export.
 */
export const LOAN_STATUSES = [
  ACTIVE_LOAN_STATUS,
  CLOSED_LOAN_STATUS,
] as const;

/**
 * Backward compatibility.
 *
 * Older batches imported LOAN_STATUS.
 */
export const LOAN_STATUS =
  LOAN_STATUSES;

/**
 * Loan status type.
 */
export type LoanStatus =
  (typeof LOAN_STATUSES)[number];

export function isActiveLoan(
  status: LoanStatus,
): boolean {
  return (
    status ===
    ACTIVE_LOAN_STATUS
  );
}

export function isClosedLoan(
  status: LoanStatus,
): boolean {
  return (
    status ===
    CLOSED_LOAN_STATUS
  );
}

export function getLoanStatuses(): readonly LoanStatus[] {
  return LOAN_STATUSES;
}