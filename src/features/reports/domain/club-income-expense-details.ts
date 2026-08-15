import { compareCalendarDates, formatDate, toCalendarDate } from "@/lib/utils/date";

import type { IncomeExpenseDetail } from "./income-expense-statement";

function getDetailDateKey(date: Date): string {
  return toCalendarDate(date).toISOString().slice(0, 10);
}

/**
 * Combines statement lines of the same type on the same calendar date.
 */
export function clubIncomeExpenseDetails(details: IncomeExpenseDetail[]): IncomeExpenseDetail[] {
  const grouped = new Map<string, IncomeExpenseDetail>();

  for (const detail of details) {
    const key = getDetailDateKey(detail.date);
    const existing = grouped.get(key);

    if (existing) {
      existing.amount += detail.amount;
      continue;
    }

    grouped.set(key, {
      date: toCalendarDate(detail.date),
      description: formatDate(detail.date),
      amount: detail.amount,
      meetingId: detail.meetingId,
    });
  }

  return [...grouped.values()].sort((left, right) => compareCalendarDates(left.date, right.date));
}
