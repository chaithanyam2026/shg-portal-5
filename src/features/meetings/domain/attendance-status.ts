export const ATTENDANCE_STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  EXCUSED: "EXCUSED",
} as const;

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export const ATTENDANCE_STATUS_VALUES = [
  ATTENDANCE_STATUS.PRESENT,
  ATTENDANCE_STATUS.ABSENT,
  ATTENDANCE_STATUS.EXCUSED,
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
    value: ATTENDANCE_STATUS.EXCUSED,
    label: "Excused",
  },
] as const;

export function getAttendanceStatusLabel(status: AttendanceStatus): string {
  const option = ATTENDANCE_STATUS_OPTIONS.find((item) => item.value === status);

  return option?.label ?? status;
}
