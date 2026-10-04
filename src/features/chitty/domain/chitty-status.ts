export const CHITTY_STATUSES = {
  ACTIVE: "ACTIVE",
  CLOSED: "CLOSED",
} as const;

export const CHITTY_STATUS_VALUES = Object.values(CHITTY_STATUSES);

export type ChittyStatus = (typeof CHITTY_STATUS_VALUES)[number];

export function isChittyStatus(value: unknown): value is ChittyStatus {
  return typeof value === "string" && CHITTY_STATUS_VALUES.includes(value as ChittyStatus);
}
