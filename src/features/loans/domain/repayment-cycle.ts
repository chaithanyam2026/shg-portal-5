import { compareCalendarDates, toCalendarDate } from "@/lib/utils/date";

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
 * First interest period starts on the disbursement date.
 * Callers often pass disbursedDate as previousRepaymentDate for that period.
 */
function isFirstRepayment(input: RepaymentCycleInput): boolean {
  if (input.previousRepaymentDate == null) {
    return true;
  }

  return compareCalendarDates(input.previousRepaymentDate, input.disbursedDate) === 0;
}

/**
 * Whole calendar days in an interest period.
 *
 * The first period includes both the start and end dates.
 * Later periods exclude the start date so the previous period's
 * end date is not charged twice.
 */
function calculateDays(fromDate: Date, toDate: Date, includeStartDay: boolean): number {
  const elapsed = Math.round(
    (toCalendarDate(toDate).getTime() - toCalendarDate(fromDate).getTime()) / MILLISECONDS_PER_DAY,
  );

  if (elapsed < 0) {
    return 0;
  }

  return includeStartDay ? elapsed + 1 : elapsed;
}

export function getRepaymentCycle(input: RepaymentCycleInput): RepaymentCycle {
  const fromDate = getPreviousTransactionDate(input);

  const toDate = input.repaymentDate;
  const firstRepayment = isFirstRepayment(input);

  return {
    isFirstRepayment: firstRepayment,

    fromDate,

    toDate,

    interestDays: calculateDays(fromDate, toDate, firstRepayment),
  };
}
