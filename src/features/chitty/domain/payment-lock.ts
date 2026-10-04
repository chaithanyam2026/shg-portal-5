import { APP_TIMEZONE, compareCalendarDates, toCalendarDate } from "@/lib/utils/date";

/** Members cannot edit at or after this local time on the current Sunday. */
export const CHITTY_PAYMENT_LOCK_HOUR = 20;

export const CHITTY_PAYMENT_LOCK_MINUTE = 0;

export const CHITTY_PAYMENT_LOCK_LABEL = "8:00 PM";

function getTimePartsInAppTimezone(date: Date): { hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return {
    hour: Number(parts.find((part) => part.type === "hour")?.value),
    minute: Number(parts.find((part) => part.type === "minute")?.value),
  };
}

export function isCurrentChittySunday(now: Date, sheetDate: Date): boolean {
  return compareCalendarDates(toCalendarDate(now), toCalendarDate(sheetDate)) === 0;
}

/** True for any day other than the sheet date, and on that date from 8:00 PM onward. */
export function isAfterChittyPaymentCutoff(now: Date, sheetDate: Date): boolean {
  if (!isCurrentChittySunday(now, sheetDate)) {
    return true;
  }

  const { hour, minute } = getTimePartsInAppTimezone(now);

  if (hour > CHITTY_PAYMENT_LOCK_HOUR) {
    return true;
  }

  return hour === CHITTY_PAYMENT_LOCK_HOUR && minute >= CHITTY_PAYMENT_LOCK_MINUTE;
}
