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

export type MonthlyLoanFineEvaluationInput = {
  minimumMonthlyRepayment: number;

  principalPaidThisMonth: number;

  pendingFineBefore: number;

  paidLoanFine: number;
};

export type MonthlyLoanFineEvaluation = {
  shouldApplyFine: boolean;

  fineAmount: number;

  reason: string;
};

export type MonthlyLoanFineAtMonthEndInput = {
  minimumMonthlyRepayment: number;

  principalPaidInMonth: number;

  pendingFineAtMonthStart: number;

  finePaidDuringMonth: number;
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

/**
 * Evaluates the monthly loan fine on the first day of the next month.
 */
export function evaluateMonthlyLoanFineAtMonthEnd(
  input: MonthlyLoanFineAtMonthEndInput,
): MonthlyLoanFineEvaluation {
  if (input.minimumMonthlyRepayment === 0) {
    return {
      shouldApplyFine: false,

      fineAmount: 0,

      reason: "No minimum monthly repayment required.",
    };
  }

  const metMinimumPrincipal =
    input.principalPaidInMonth >= input.minimumMonthlyRepayment;

  const metPendingFines =
    input.pendingFineAtMonthStart === 0 ||
    input.finePaidDuringMonth >= input.pendingFineAtMonthStart;

  if (metMinimumPrincipal && metPendingFines) {
    return {
      shouldApplyFine: false,

      fineAmount: 0,

      reason: "Minimum monthly repayment and pending loan fines paid.",
    };
  }

  const reasons: string[] = [];

  if (!metMinimumPrincipal) {
    reasons.push(
      `Minimum monthly principal of ₹${input.minimumMonthlyRepayment.toLocaleString("en-IN")} not met.`,
    );
  }

  if (!metPendingFines) {
    reasons.push("Pending loan fines were not fully paid during the month.");
  }

  return {
    shouldApplyFine: true,

    fineAmount: MONTHLY_LOAN_FINE,

    reason: reasons.join(" "),
  };
}

/**
 * Evaluates whether a monthly loan fine
 * should be charged after a repayment.
 *
 * To avoid the fine, the member must pay
 * the minimum monthly principal plus any
 * pending loan fines from earlier months.
 */
export function evaluateMonthlyLoanFine(
  input: MonthlyLoanFineEvaluationInput,
): MonthlyLoanFineEvaluation {
  if (input.minimumMonthlyRepayment === 0) {
    return {
      shouldApplyFine: false,

      fineAmount: 0,

      reason: "No minimum monthly repayment required.",
    };
  }

  const metMinimumPrincipal =
    input.principalPaidThisMonth >= input.minimumMonthlyRepayment;

  const metPendingFines =
    input.pendingFineBefore === 0 || input.paidLoanFine >= input.pendingFineBefore;

  if (metMinimumPrincipal && metPendingFines) {
    return {
      shouldApplyFine: false,

      fineAmount: 0,

      reason: "Minimum monthly repayment and pending loan fines paid.",
    };
  }

  const reasons: string[] = [];

  if (!metMinimumPrincipal) {
    reasons.push(
      `Minimum monthly principal of ₹${input.minimumMonthlyRepayment.toLocaleString("en-IN")} not met.`,
    );
  }

  if (!metPendingFines) {
    reasons.push("Pending loan fines were not fully paid.");
  }

  return {
    shouldApplyFine: true,

    fineAmount: MONTHLY_LOAN_FINE,

    reason: reasons.join(" "),
  };
}
