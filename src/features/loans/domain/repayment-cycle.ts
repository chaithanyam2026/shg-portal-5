export type RepaymentCycleInput = {
  disbursedDate: Date;

  repaymentDate: Date;

  previousRepaymentDate?: Date;
};

export type RepaymentCycle = {
  isFirstRepayment: boolean;

  fromDate: Date;

  toDate: Date;

  interestDays: number;
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Returns the previous transaction date
 * for interest calculation.
 *
 * If this is the first repayment,
 * the loan disbursement date becomes
 * the previous transaction date.
 */
function getPreviousTransactionDate(input: RepaymentCycleInput): Date {
  return input.previousRepaymentDate ?? input.disbursedDate;
}

/**
 * Returns whether the repayment is
 * the first repayment for the loan.
 */
function isFirstRepayment(input: RepaymentCycleInput): boolean {
  return input.previousRepaymentDate == null;
}

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
function calculateDays(fromDate: Date, toDate: Date): number {
  return Math.max(
    Math.floor((toDate.getTime() - fromDate.getTime()) / MILLISECONDS_PER_DAY) + 1,
    0,
  );
}

export function getRepaymentCycle(input: RepaymentCycleInput): RepaymentCycle {
  const fromDate = getPreviousTransactionDate(input);

  const toDate = input.repaymentDate;

  return {
    isFirstRepayment: isFirstRepayment(input),

    fromDate,

    toDate,

    interestDays: calculateDays(fromDate, toDate),
  };
}
