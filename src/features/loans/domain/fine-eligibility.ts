import { isAfterFirstSundayOfMonth } from "./calendar";

import type { RepaymentCycle } from "./repayment-cycle";

/**
 * Input required to determine
 * whether monthly loan fine should
 * be evaluated.
 */
export type FineEligibilityInput = {
  /**
   * Loan disbursement date.
   */
  disbursedDate: Date;

  /**
   * Current repayment cycle.
   */
  repaymentCycle: RepaymentCycle;
};

/**
 * Fine eligibility result.
 */
export type FineEligibility = {
  /**
   * Whether monthly fine should be
   * calculated.
   */
  isEligible: boolean;

  /**
   * Calendar month being evaluated.
   *
   * 0 = January
   */
  evaluationMonth: number;

  /**
   * Calendar year being evaluated.
   */
  evaluationYear: number;

  /**
   * Explanation.
   */
  reason: string;
};

/**
 * Determines whether the monthly
 * loan fine should be evaluated.
 *
 * Business Rules
 * --------------
 *
 * Each meeting evaluates the immediately
 * preceding calendar month.
 *
 * Disbursement month
 * ------------------
 * • Disbursed on or before the first Sunday
 *   → minimum repayment and fine apply for
 *     that month.
 * • Disbursed after the first Sunday
 *   → that month is exempt from fine.
 */
export function getFineEligibility({
  disbursedDate,
  repaymentCycle,
}: FineEligibilityInput): FineEligibility {
  const evaluationDate = new Date(
    repaymentCycle.toDate.getFullYear(),
    repaymentCycle.toDate.getMonth() - 1,
    1,
  );

  const evaluationMonth = evaluationDate.getMonth();

  const evaluationYear = evaluationDate.getFullYear();

  const isStartingMonth =
    disbursedDate.getFullYear() === evaluationYear && disbursedDate.getMonth() === evaluationMonth;

  if (isStartingMonth && isAfterFirstSundayOfMonth(disbursedDate)) {
    return {
      isEligible: false,

      evaluationMonth,

      evaluationYear,

      reason: "Loan disbursed after the first Sunday of the starting month.",
    };
  }

  return {
    isEligible: true,

    evaluationMonth,

    evaluationYear,

    reason: "Monthly loan fine evaluation applicable.",
  };
}
