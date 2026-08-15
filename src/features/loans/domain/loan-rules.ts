import { FINANCIAL_YEAR_STATUS } from "@/features/financial-year/domain/financial-year-status";
import type { FinancialYearStatus } from "@/features/financial-year/domain/financial-year-status";

import { ACTIVE_LOAN_STATUS, type LoanStatus } from "./loan-status";
import { LoanType, NORMAL_LOAN_TYPE, SPECIAL_LOAN_TYPE } from "./loan-type";

export const MONTHLY_LOAN_FINE = 100;

export const MINIMUM_LOAN_THRESHOLD = 1000;

export const MINIMUM_REPAYMENT_TIER = 25000;

export const MINIMUM_REPAYMENT_STEP = 800;

/**
 * Loan number configuration.
 */
export const LOAN_NUMBER_PREFIX = "LN";

/**
 * Maximum number of active loans
 * allowed for each loan type.
 */
export const MAX_ACTIVE_NORMAL_LOANS = 1;

export const MAX_ACTIVE_SPECIAL_LOANS = 1;

/**
 * Returns the maximum active loans
 * permitted for a loan type.
 */
export function getMaximumActiveLoans(loanType: LoanType): number {
  switch (loanType) {
    case NORMAL_LOAN_TYPE:
      return MAX_ACTIVE_NORMAL_LOANS;

    case SPECIAL_LOAN_TYPE:
      return MAX_ACTIVE_SPECIAL_LOANS;
  }
}

/**
 * Determines whether another active
 * loan of the same type may be
 * sanctioned.
 */
export function canSanctionLoan(loanType: LoanType, activeLoanCount: number): boolean {
  return activeLoanCount < getMaximumActiveLoans(loanType);
}

/**
 * Minimum monthly repayment can be changed while the loan is
 * active and its financial year is still in progress.
 */
export function canUpdateExpectedMonthlyRepayment(input: {
  loanStatus: LoanStatus;
  financialYearStatus: FinancialYearStatus;
}): boolean {
  return (
    input.loanStatus === ACTIVE_LOAN_STATUS &&
    input.financialYearStatus === FINANCIAL_YEAR_STATUS.IN_PROGRESS
  );
}
