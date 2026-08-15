import { compareCalendarDates, toCalendarDate } from "@/lib/utils/date";

/**
 * Repayments belong to a loan only on or after the start date
 * and on or before the close date when the loan is closed.
 */
export function isWithinLoanRepaymentWindow(
  repaymentDate: Date,
  disbursedDate: Date,
  closedDate?: Date | null,
): boolean {
  if (compareCalendarDates(repaymentDate, disbursedDate) < 0) {
    return false;
  }

  if (closedDate && compareCalendarDates(repaymentDate, closedDate) > 0) {
    return false;
  }

  return true;
}

/**
 * Interest and fines stop at the earlier of financial year end
 * and the loan close date.
 */
export function resolveLoanCalculationEndDate(
  financialYearEndDate: Date,
  closedDate?: Date | null,
): Date {
  const fyEnd = toCalendarDate(financialYearEndDate);

  if (!closedDate) {
    return fyEnd;
  }

  const close = toCalendarDate(closedDate);

  return compareCalendarDates(close, fyEnd) < 0 ? close : fyEnd;
}
