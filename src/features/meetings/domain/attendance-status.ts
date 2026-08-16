export const ATTENDANCE_STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LEAVE: "LEAVE",
} as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export const ATTENDANCE_STATUS_VALUES = [
  ATTENDANCE_STATUS.PRESENT,
  ATTENDANCE_STATUS.ABSENT,
  ATTENDANCE_STATUS.LEAVE,
] as const;

/** Includes the previous EXCUSED value so older meeting documents still load. */
export const ATTENDANCE_STATUS_STORED_VALUES = [
  ...ATTENDANCE_STATUS_VALUES,
  "EXCUSED",
] as const;

export const ATTENDANCE_STATUS_OPTIONS = [
  {
    value: ATTENDANCE_STATUS.PRESENT,
    label: "Present",
  },
  {
    value: ATTENDANCE_STATUS.ABSENT,
    label: "Absent",
  },
  {
    value: ATTENDANCE_STATUS.LEAVE,
    label: "Leave",
  },
] as const;

export function normalizeAttendanceStatus(status: string | null | undefined): AttendanceStatus {
  if (status === ATTENDANCE_STATUS.ABSENT) {
    return ATTENDANCE_STATUS.ABSENT;
  }

  if (status === ATTENDANCE_STATUS.LEAVE || status === "EXCUSED") {
    return ATTENDANCE_STATUS.LEAVE;
  }

  return ATTENDANCE_STATUS.PRESENT;
}

export function getAttendanceStatusLabel(status: string): string {
  const option = ATTENDANCE_STATUS_OPTIONS.find(
    (item) => item.value === normalizeAttendanceStatus(status),
  );

  return option?.label ?? status;
}
