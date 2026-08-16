import type { FinancialYearStatus } from "@/features/financial-year/domain/financial-year-status";

import { ACTIVE_LOAN_STATUS, CLOSED_LOAN_STATUS, type LoanStatus } from "./loan-status";

type LoanCloseEligibilityInput = {
  loanStatus: LoanStatus;
  financialYearStatus: FinancialYearStatus;
  isClosable: boolean;
};

/**
 * A loan can be closed when it is active and either fully repaid
 * or its financial year has been approved.
 */
export function canCloseLoan({
  loanStatus,
  financialYearStatus,
  isClosable,
}: LoanCloseEligibilityInput): boolean {
  if (loanStatus !== ACTIVE_LOAN_STATUS) {
    return false;
  }

  return isClosable || financialYearStatus === "VALIDATED";
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
