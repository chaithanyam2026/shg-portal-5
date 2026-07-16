import type {
  AttendanceStatus,
} from "./attendance-fine";

import {
  calculateAttendanceFine,
} from "./calculate-attendance-fine";

import {
  calculateConsecutiveAbsence,
} from "./calculate-consecutive-absence";

export type AttendanceProcessResult = {
  consecutiveAbsence: number;

  fineCharged: number;
};

/**
 * Processes one attendance record.
 *
 * This is the only function the
 * builder needs to call.
 */
export function processAttendance(
  currentStreak: number,
  status: AttendanceStatus,
): AttendanceProcessResult {
  const consecutiveAbsence =
    calculateConsecutiveAbsence(
      currentStreak,
      status,
    );

  const fineCharged =
    calculateAttendanceFine(
      status,
      consecutiveAbsence,
    );

  return {
    consecutiveAbsence,
    fineCharged,
  };
}