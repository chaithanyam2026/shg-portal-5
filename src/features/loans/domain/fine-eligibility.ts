import type {
  RepaymentCycle,
} from "./repayment-cycle";

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
 * Loan started on 15-Jan
 *
 * 01-Feb Meeting
 *   → Evaluate January
 *   → Skip (partial starting month)
 *
 * 01-Mar Meeting
 *   → Evaluate February
 *   → Apply fine if minimum repayment
 *     not satisfied.
 *
 * 01-Apr Meeting
 *   → Evaluate March
 *   → Apply fine if minimum repayment
 *     not satisfied.
 *
 * Only the loan's starting month
 * receives the partial-month exemption.
 *
 * Every subsequent completed month
 * participates in monthly fine
 * evaluation.
 */
export function getFineEligibility({
  disbursedDate,
  repaymentCycle,
}: FineEligibilityInput): FineEligibility {
  /**
   * Every meeting evaluates the
   * immediately preceding calendar
   * month.
   */
  const evaluationDate =
    new Date(
      repaymentCycle.toDate.getFullYear(),
      repaymentCycle.toDate.getMonth() - 1,
      1,
    );

  const evaluationMonth =
    evaluationDate.getMonth();

  const evaluationYear =
    evaluationDate.getFullYear();

  /**
   * Is this the month in which the
   * loan was originally disbursed?
   */
  const isStartingMonth =
    disbursedDate.getFullYear() ===
      evaluationYear &&
    disbursedDate.getMonth() ===
      evaluationMonth;

  /**
   * Partial starting month is exempt.
   */
  if (
    isStartingMonth &&
    disbursedDate.getDate() > 1
  ) {
    return {
      isEligible: false,

      evaluationMonth,

      evaluationYear,

      reason:
        "Partial starting month is exempt from loan fine.",
    };
  }

  return {
    isEligible: true,

    evaluationMonth,

    evaluationYear,

    reason:
      "Monthly loan fine evaluation applicable.",
  };
}