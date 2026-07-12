export const MONTHLY_LOAN_FINE = 100;
import {
  LoanType,
  NORMAL_LOAN_TYPE,
  SPECIAL_LOAN_TYPE,
} from "./loan-type";

export const MINIMUM_MONTHLY_REPAYMENTS = [
  {
    minLoanAmount: 1000,
    maxLoanAmount: 25000,
    minimumRepayment: 800,
  },
  {
    minLoanAmount: 25001,
    maxLoanAmount: 50000,
    minimumRepayment: 1600,
  },
  {
    minLoanAmount: 50001,
    maxLoanAmount: 75000,
    minimumRepayment: 2400,
  },
  {
    minLoanAmount: 75001,
    maxLoanAmount: 100000,
    minimumRepayment: 3200,
  },
] as const;

export function getMinimumMonthlyRepayment(
  loanAmount: number,
): number {
  if (loanAmount <= 10000) {
    return 500;
  }

  if (loanAmount <= 20000) {
    return 800;
  }

  if (loanAmount <= 30000) {
    return 1200;
  }

  return Math.ceil(loanAmount * 0.05);
} 



/**
 * Loan number configuration.
 */
export const LOAN_NUMBER_PREFIX =
  "LN";


/**
 * Maximum number of active loans
 * allowed for each loan type.
 */
export const MAX_ACTIVE_NORMAL_LOANS =
  1;

export const MAX_ACTIVE_SPECIAL_LOANS =
  1;

/**
 * Returns the maximum active loans
 * permitted for a loan type.
 */
export function getMaximumActiveLoans(
  loanType: LoanType,
): number {
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
export function canSanctionLoan(
  loanType: LoanType,
  activeLoanCount: number,
): boolean {
  return (
    activeLoanCount <
    getMaximumActiveLoans(
      loanType,
    )
  );
}