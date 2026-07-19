import { MONTHLY_LOAN_FINE } from "./loan-rules";

/**
 * Monthly loan fine calculation.
 *
 * A fine is applied when the member
 * pays less than the expected monthly
 * principal repayment.
 */
export type LoanFineResult = {
  expectedRepayment: number;

  actualRepayment: number;

  shortage: number;

  fineAmount: number;

  shouldApplyFine: boolean;
};

type CalculateLoanFineInput = {
  expectedMonthlyRepayment: number;

  principalPaidThisMonth: number;
};

/**
 * Calculates the monthly loan fine.
 */
export function calculateLoanFine({
  expectedMonthlyRepayment,
  principalPaidThisMonth,
}: CalculateLoanFineInput): LoanFineResult {
  const shortage = Math.max(expectedMonthlyRepayment - principalPaidThisMonth, 0);

  const shouldApplyFine = shortage > 0;

  return {
    expectedRepayment: expectedMonthlyRepayment,

    actualRepayment: principalPaidThisMonth,

    shortage,

    fineAmount: shouldApplyFine ? MONTHLY_LOAN_FINE : 0,

    shouldApplyFine,
  };
}
