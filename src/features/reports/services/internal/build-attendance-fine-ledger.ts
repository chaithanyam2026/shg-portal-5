import type {
  AttendanceFineEntry,
  AttendanceFineSummary,
} from "../../domain";

import {
  processAttendance,
} from "../../domain";

import type {
  AttendanceMember,
} from "./attendance-fine-types";

import {
  calculatePendingAttendanceFine,
} from "./calculate-pending-attendance-fine";

/**
 * Builds the attendance fine ledger
 * for all members.
 *
 * This is the single source of truth
 * for attendance fine calculation.
 */
export function buildAttendanceFineLedger(
  members: AttendanceMember[],
): AttendanceFineSummary[] {
  return members.map((member) => {
    /**
     * Meetings must always be processed
     * chronologically.
     */
    const meetings = [
      ...member.meetings,
    ].sort(
      (a, b) =>
        a.meetingDate.getTime() -
        b.meetingDate.getTime(),
    );

    /**
     * Running absence streak.
     */
    let consecutiveAbsence = 0;

    /**
     * Attendance statistics.
     */
    let presentCount = 0;

    let absentCount = 0;

    let leaveCount = 0;

    /**
     * Ledger entries.
     */
    const entries:
      AttendanceFineEntry[] =
      [];

    for (const meeting of meetings) {
      switch (
        meeting.status
      ) {
        case "PRESENT":
          presentCount++;
          break;

        case "ABSENT":
          absentCount++;
          break;

        case "LEAVE":
          leaveCount++;
          break;
      }

      const result =
        processAttendance(
          consecutiveAbsence,
          meeting.status,
        );

      consecutiveAbsence =
        result.consecutiveAbsence;

      entries.push({
        meetingId:
          meeting.meetingId,

        meetingDate:
          meeting.meetingDate,

        status:
          meeting.status,

        consecutiveAbsence,

        fineCharged:
          result.fineCharged,

        finePaid:
          meeting.finePaid,

        /**
         * Updated later by the
         * pending fine calculator.
         */
        pendingFine: 0,
      });
    }

    /**
     * Calculate running balances.
     */
    const summary =
      calculatePendingAttendanceFine({
        entries,
      });

    /**
     * Attendance percentage.
     *
     * Leave is considered as a meeting,
     * but not as present.
     */
    const attendancePercentage =
      meetings.length === 0
        ? 0
        : Number(
            (
              (presentCount /
                meetings.length) *
              100
            ).toFixed(2),
          );

    return {
      memberId:
        member.memberId,

      memberCode:
        member.memberCode,

      memberName:
        member.memberName,

      presentCount,

      absentCount,

      leaveCount,

      attendancePercentage,

      totalFine:
        summary.totalFine,

      paidFine:
        summary.paidFine,

      pendingFine:
        summary.pendingFine,

      entries:
        summary.entries,
    };
  });
}