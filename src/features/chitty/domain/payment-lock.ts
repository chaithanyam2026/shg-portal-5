import { APP_TIMEZONE, compareCalendarDates, toCalendarDate } from "@/lib/utils/date";

/** Payments cannot be edited at or after this local time each day. */
export const CHITTY_PAYMENT_LOCK_HOUR = 19;

export const CHITTY_PAYMENT_LOCK_MINUTE = 45;

export const CHITTY_PAYMENT_LOCK_LABEL = "7:45 PM";

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

export function isChittyPaymentLocked(
  now: Date,
  sheetDate: Date,
  options?: { allowPastEdits?: boolean },
): boolean {
  if (options?.allowPastEdits) {
    return false;
  }
  const today = toCalendarDate(now);
  const sheet = toCalendarDate(sheetDate);

  if (compareCalendarDates(sheet, today) !== 0) {
    return true;
  }

  const { hour, minute } = getTimePartsInAppTimezone(now);

  if (hour > CHITTY_PAYMENT_LOCK_HOUR) {
    return true;
  }

  return hour === CHITTY_PAYMENT_LOCK_HOUR && minute >= CHITTY_PAYMENT_LOCK_MINUTE;
}
