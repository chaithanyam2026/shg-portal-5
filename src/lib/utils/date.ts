export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Normalizes a date to local calendar midnight.
 */
export function toCalendarDate(value: Date | string): Date {
  const date = value instanceof Date ? value : new Date(value);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
  const start = toCalendarDate(date);
  const end = new Date(start);

  end.setDate(end.getDate() + 1);

  return { start, end };
}

/**
 * Parses an HTML date input value (YYYY-MM-DD) as a local calendar date.
 */
export function parseDateInputValue(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function toIsoString(value: Date | string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  return date.toISOString();
}
