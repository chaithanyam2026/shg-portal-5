import type { RepaymentCycle } from "./repayment-cycle";

/* const MILLISECONDS_PER_DAY =
  24 *
  60 *
  60 *
  1000; */

/**
 * Calculates the number of whole days
 * between two dates.
 *
 * Rules
 * -----
 * • Same day => 0
 * • Negative interval => 0
 * • Positive interval => Actual days
 */
/* export function calculateInterestDays(
  fromDate: Date,
  toDate: Date,
): number {
  return Math.max(
    Math.floor(
      (toDate.getTime() -
        fromDate.getTime()) /
        MILLISECONDS_PER_DAY,
    ),
    0,
  );
} */

/**
 * Calculates simple interest accrued
 * between two dates.
 */

type CalculateInterestInput = {
  /**
   * Current outstanding principal.
   */
  outstandingPrincipal: number;

  /**
   * Annual interest rate.
   */
  annualInterestRate: number;

  /**
   * Repayment period for which
   * interest should be calculated.
   */
  repaymentCycle: RepaymentCycle;
};

/**
 * Interest calculation result.
 */
export type InterestCalculation = {
  /**
   * Number of days for which
   * interest was accrued.
   */
  interestDays: number;

  /**
   * Calculated interest amount.
   */
  interestAmount: number;
};

/**
 * Calculates simple interest accrued
 * during a repayment cycle.
 *
 * The repayment cycle already contains
 * the calculated interest period.
 */
export function calculateInterest({
  outstandingPrincipal,
  annualInterestRate,
  repaymentCycle,
}: CalculateInterestInput): InterestCalculation {
  const days = repaymentCycle.interestDays;

  if (outstandingPrincipal <= 0 || annualInterestRate <= 0 || days <= 0)
    return {
      interestDays: days,
      interestAmount: 0,
    };

  const interest = (outstandingPrincipal * annualInterestRate * days) / (365 * 100);

  return {
    interestDays: days,

    interestAmount: Number(interest.toFixed(2)),
  };
}
