import type { AttendanceStatus } from "./attendance-fine";

/**
 * Calculates the next consecutive
 * absence count.
 *
 * Rules
 * -----
 * PRESENT
 *   Reset streak.
 *
 * LEAVE
 *   Keep current streak.
 *
 * ABSENT
 *   Increase streak.
 */
export function calculateConsecutiveAbsence(
  currentStreak: number,
  status: AttendanceStatus,
): number {
  switch (status) {
    case "PRESENT":
      return 0;

    case "LEAVE":
      return currentStreak;

    case "ABSENT":
      return currentStreak + 1;

    default:
      return currentStreak;
  }
}
