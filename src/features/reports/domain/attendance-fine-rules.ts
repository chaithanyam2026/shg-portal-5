/**
 * Attendance fine schedule.
 *
 * Returned value is the
 * incremental fine for the
 * current meeting.
 */
export const ATTENDANCE_FINE = {
  FIRST_ABSENCE: 10,

  SECOND_ABSENCE: 20,

  THIRD_ABSENCE: 70,

  ADDITIONAL_ABSENCE: 100,
} as const;

/**
 * Returns the fine generated
 * for the current meeting.
 */
export function getAttendanceFine(
  consecutiveAbsence: number,
): number {
  switch (
    consecutiveAbsence
  ) {
    case 1:
      return ATTENDANCE_FINE.FIRST_ABSENCE;

    case 2:
      return ATTENDANCE_FINE.SECOND_ABSENCE;

    case 3:
      return ATTENDANCE_FINE.THIRD_ABSENCE;

    default:
      return consecutiveAbsence >= 4
        ? ATTENDANCE_FINE.ADDITIONAL_ABSENCE
        : 0;
  }
}