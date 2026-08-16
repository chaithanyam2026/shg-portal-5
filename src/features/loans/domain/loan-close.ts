import { compareCalendarDates } from "@/lib/utils/date";

import { ACTIVE_LOAN_STATUS, CLOSED_LOAN_STATUS, type LoanStatus } from "./loan-status";

type LoanCloseEligibilityInput = {
  loanStatus: LoanStatus;
  isClosable: boolean;
  financialYearEndDate: Date | string;
  referenceDate?: Date | string;
  isOfficeBearer: boolean;
  isAdmin: boolean;
};

export function hasFinancialYearEndDatePassed(
  financialYearEndDate: Date | string,
  referenceDate: Date | string = new Date(),
): boolean {
  return compareCalendarDates(referenceDate, financialYearEndDate) > 0;
}

/**
 * A loan can be closed when it is active and fully repaid.
 * After the financial year end date, the president, secretary,
 * treasurer, or an administrator may close it with outstanding principal.
 */
export function canCloseLoan({
  loanStatus,
  isClosable,
  financialYearEndDate,
  referenceDate = new Date(),
  isOfficeBearer,
  isAdmin,
}: LoanCloseEligibilityInput): boolean {
  if (loanStatus !== ACTIVE_LOAN_STATUS) {
    return false;
  }

  if (isClosable) {
    return true;
  }

  return (
    hasFinancialYearEndDatePassed(financialYearEndDate, referenceDate) &&
    (isOfficeBearer || isAdmin)
  );
}

export function formatLoanClosingRemark(comment: string): string {
  return `[Closed] ${comment.trim()}`;
}

export function stripLoanClosingRemarks(remarks: string): string {
  return remarks
    .split("\n")
    .filter((line) => !line.trim().startsWith("[Closed]"))
    .join("\n")
    .trim();
}

export function canReopenLoan(status: LoanStatus) {
  return status === CLOSED_LOAN_STATUS;
}

export type LoanCloseBalanceInput = {
  outstandingPrincipal: number;
  pendingInterest: number;
  pendingLoanFine: number;
  pendingAbsentFine: number;
  pendingContribution: number;
};

export function calculateLoanCloseTotal({
  outstandingPrincipal,
  pendingInterest,
  pendingLoanFine,
  pendingAbsentFine,
  pendingContribution,
}: LoanCloseBalanceInput): number {
  return (
    outstandingPrincipal +
    pendingInterest +
    pendingLoanFine +
    pendingAbsentFine +
    pendingContribution
  );
}
