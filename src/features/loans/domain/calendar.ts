/**
 * Returns the first Sunday of a calendar month.
 */
export function getFirstSundayOfMonth(year: number, month: number): Date {
  const firstDay = new Date(year, month, 1);
  const weekday = firstDay.getDay();
  const daysUntilSunday = weekday === 0 ? 0 : 7 - weekday;

  return new Date(year, month, 1 + daysUntilSunday);
}

/**
 * Returns true when the date falls after the first
 * Sunday of its calendar month.
 */
export function isAfterFirstSundayOfMonth(date: Date): boolean {
  const firstSunday = getFirstSundayOfMonth(date.getFullYear(), date.getMonth());

  const disbursedDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const firstSundayDay = new Date(
    firstSunday.getFullYear(),
    firstSunday.getMonth(),
    firstSunday.getDate(),
  );

  return disbursedDay.getTime() > firstSundayDay.getTime();
}
