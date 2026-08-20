import { compareCalendarDates, toCalendarDate, toDateInputValue } from "@/lib/utils/date";

const SUNDAY = 0;
const WEEK_DAYS = 7;

function addUtcDays(date: Date, days: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}

export function isSunday(date: Date | string): boolean {
  return toCalendarDate(date).getUTCDay() === SUNDAY;
}

export function getLatestSundayOnOrBefore(date: Date | string): Date {
  const calendar = toCalendarDate(date);
  return addUtcDays(calendar, -calendar.getUTCDay());
}

export function getFirstSundayOnOrAfter(date: Date | string): Date {
  const calendar = toCalendarDate(date);
  const weekday = calendar.getUTCDay();

  if (weekday === SUNDAY) {
    return calendar;
  }

  return addUtcDays(calendar, WEEK_DAYS - weekday);
}

export function listSundaysThroughLatest(startDate: Date | string, now: Date | string): Date[] {
  const start = getFirstSundayOnOrAfter(startDate);
  const end = getLatestSundayOnOrBefore(now);

  if (compareCalendarDates(end, start) < 0) {
    return [end];
  }

  const sundays: Date[] = [];

  for (
    let current = start;
    compareCalendarDates(current, end) <= 0;
    current = addUtcDays(current, WEEK_DAYS)
  ) {
    sundays.push(current);
  }

  return sundays;
}

export function toSundayDateValues(startDate: Date | string, now: Date | string): string[] {
  return listSundaysThroughLatest(startDate, now).map((date) => toDateInputValue(date));
}

export function resolveDefaultSundayDate(options: string[], today: string): string {
  if (options.includes(today)) {
    return today;
  }

  return options[options.length - 1] ?? today;
}
