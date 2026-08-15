import { MONTHLY_LOAN_FINE } from "./loan-rules";

const MINIMUM_LOAN_THRESHOLD = 1000;

const MINIMUM_REPAYMENT_TIER = 25000;

const MINIMUM_REPAYMENT_STEP = 800;

/**
 * Minimum monthly principal repayment based on
 * disbursed loan amount.
 *
 * Rules
 * -----
 * • Below 1,000 → no minimum
 * • 1,000–25,000 → 800
 * • 25,001–50,000 → 1,600
 * • 50,001–75,000 → 2,400
 * • Each additional 25,000 adds 800
 */
export function getMinimumMonthlyRepayment(disbursedAmount: number): number {
  if (disbursedAmount < MINIMUM_LOAN_THRESHOLD) {
    return 0;
  }

  const tier = Math.ceil(disbursedAmount / MINIMUM_REPAYMENT_TIER);

  return tier * MINIMUM_REPAYMENT_STEP;
}

export function formatMinimumMonthlyRepayment(minimum: number): string {
  if (minimum === 0) {
    return "No minimum monthly repayment";
  }

  return `Minimum monthly repayment: ₹${minimum.toLocaleString("en-IN")}`;
}

export function getMinimumMonthlyRepaymentDescription(disbursedAmount: number): string {
  return formatMinimumMonthlyRepayment(getMinimumMonthlyRepayment(disbursedAmount));
}

export function getLoanFineAmount(): number {
  return MONTHLY_LOAN_FINE;
}
