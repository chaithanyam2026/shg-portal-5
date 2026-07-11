export const ATTENDANCE_STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  EXCUSED: "EXCUSED",
} as const;

export const ATTENDANCE_STATUS_VALUES =
  Object.values(ATTENDANCE_STATUS);

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS_VALUES)[number];

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

export function getAttendanceStatusLabel(
  status: AttendanceStatus,
): string {
  const option =
    ATTENDANCE_STATUS_OPTIONS.find(
      (item) => item.value === status,
    );

  return option?.label ?? status;
}