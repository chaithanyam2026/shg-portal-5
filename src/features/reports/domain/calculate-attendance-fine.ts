import type { AttendanceStatus } from "./attendance-fine";

import { getAttendanceFine } from "./attendance-fine-rules";

/**
 * Calculates the attendance fine
 * generated for the current meeting.
 *
 * Rules
 * -----
 * PRESENT
 *   No fine.
 *
 * LEAVE
 *   No fine.
 *
 * ABSENT
 *   Fine depends on the updated
 *   consecutive absence count.
 */
export function calculateAttendanceFine(
  status: AttendanceStatus,
  consecutiveAbsence: number,
): number {
  if (status !== "ABSENT") {
    return 0;
  }

  return getAttendanceFine(consecutiveAbsence);
}
