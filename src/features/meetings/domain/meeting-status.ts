export const MEETING_STATUS = {
  DRAFT: "DRAFT",
  IN_PROGRESS: "IN_PROGRESS",
  APPROVED: "APPROVED",
  CLOSED: "CLOSED",
} as const;

export const MEETING_STATUS_VALUES = Object.values(MEETING_STATUS);

export type MeetingStatus =
  (typeof MEETING_STATUS_VALUES)[number];