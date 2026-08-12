import { getFineEligibility } from "./fine-eligibility";

import { calculateLoanFine } from "./loan-fine";

import type { RepaymentCycle } from "./repayment-cycle";

/**
 * Monthly fine calculation input.
 */
export type MonthlyFineInput = {
  /**
   * Loan disbursement date.
   */
  disbursedDate: Date;

  /**
   * Current repayment cycle.
   */
  repaymentCycle: RepaymentCycle;

  /**
   * Minimum principal repayment
   * expected for the month.
   */
  expectedMonthlyRepayment: number;

  /**
   * Principal repaid during the
   * evaluated month.
   */
  principalPaidThisMonth: number;
};

/**
 * Monthly fine calculation result.
 */
export type MonthlyFineResult = {
  /**
   * Whether monthly fine was
   * evaluated.
   */
  isApplicable: boolean;

  /**
   * Fine charged.
   */
  fineAmount: number;

  /**
   * Month being evaluated.
   */
  evaluationMonth: number;

  /**
   * Year being evaluated.
   */
  evaluationYear: number;

  /**
   * Explanation.
   */
  reason: string;
};

/**
 * Calculates the monthly loan fine.
 *
 * Fine is applied only if the
 * evaluation month is eligible.
 */
export function calculateMonthlyFine({
  disbursedDate,
  repaymentCycle,
  expectedMonthlyRepayment,
  principalPaidThisMonth,
}: MonthlyFineInput): MonthlyFineResult {
  const eligibility = getFineEligibility({
    disbursedDate,
    repaymentCycle,
  });

  if (!eligibility.isEligible) {
    return {
      isApplicable: false,

      fineAmount: 0,

      evaluationMonth: eligibility.evaluationMonth,

      evaluationYear: eligibility.evaluationYear,

      reason: eligibility.reason,
    };
  }

  const fine = calculateLoanFine({
    expectedMonthlyRepayment,

    principalPaidThisMonth,
  });

  return {
    isApplicable: true,

    fineAmount: fine.fineAmount,

    evaluationMonth: eligibility.evaluationMonth,

    evaluationYear: eligibility.evaluationYear,

    reason: fine.shouldApplyFine
      ? "Minimum monthly repayment not met."
      : "Minimum monthly repayment achieved.",
  };
}
