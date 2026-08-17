export const APP_TIMEZONE = "Asia/Kolkata";

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

type CalendarParts = {
  year: number;
  month: number;
  day: number;
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

/**
 * Calendar year/month/day in the app timezone (Asia/Kolkata).
 * Also accepts YYYY-MM-DD as that calendar day, not as UTC-then-shift.
 */
export function getCalendarParts(value: Date | string): CalendarParts {
  if (typeof value === "string") {
    const dateOnly = value.trim().match(DATE_ONLY);

    if (dateOnly) {
      return {
        year: Number(dateOnly[1]),
        month: Number(dateOnly[2]),
        day: Number(dateOnly[3]),
      };
    }
  }

  const date = toDate(value);
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const [year, month, day] = formatted.split("-").map(Number);

  return { year, month, day };
}

/**
 * Parses an HTML date input value (YYYY-MM-DD) as UTC midnight
 * of that calendar day so MongoDB and the UI share the same date.
 */
export function parseDateInputValue(value: string): Date {
  const { year, month, day } = getCalendarParts(value);

  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Normalizes a date to UTC midnight of the Asia/Kolkata calendar day.
 * Legacy IST-midnight values (stored as previous-day 18:30Z) map to the same day.
 */
export function toCalendarDate(value: Date | string): Date {
  const { year, month, day } = getCalendarParts(value);

  return new Date(Date.UTC(year, month - 1, day));
}

export function toDateInputValue(value?: Date | string | null): string {
  const { year, month, day } = getCalendarParts(value ?? new Date());

  return `${year}-${pad(month)}-${pad(day)}`;
}

export function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: APP_TIMEZONE,
  }).format(toDate(value));
}

export function compareCalendarDates(left: Date | string, right: Date | string): number {
  return toCalendarDate(left).getTime() - toCalendarDate(right).getTime();
}

export function isCalendarDateWithinRange(
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string,
): boolean {
  return (
    compareCalendarDates(date, startDate) >= 0 && compareCalendarDates(date, endDate) <= 0
  );
}

export function getCalendarDayRange(date: Date | string): { start: Date; end: Date } {
  const utcMidnight = toCalendarDate(date);
  const istOffsetMs = (5 * 60 + 30) * 60 * 1000;

  return {
    start: new Date(utcMidnight.getTime() - istOffsetMs),
    end: new Date(utcMidnight.getTime() + istOffsetMs),
  };
}

export function toIsoString(value: Date | string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  return date.toISOString();
}
