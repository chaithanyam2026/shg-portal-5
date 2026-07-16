import connectMongo from "@/lib/db/mongodb";

import type {
  AttendanceFineDefaulter,
  AttendanceFineDefaultersReport,
} from "../domain/attendance-fine-defaulters";

import {
  buildAttendanceFineRegister,
} from "./build-attendance-fine-register";

import {
  getMemberAttendanceFine,
} from "./get-member-attendance-fine";

/**
 * Builds the Attendance Fine
 * Defaulters report.
 *
 * Includes only members having
 * pending attendance fine.
 */
export async function buildAttendanceFineDefaulters(
  financialYearId?: string,
): Promise<AttendanceFineDefaultersReport> {
  await connectMongo();

  /**
   * Load attendance fine register.
   */
  const register =
    await buildAttendanceFineRegister(
      financialYearId,
    );

  const rows:
    AttendanceFineDefaulter[] =
    [];

  let totalFine = 0;

  let paidFine = 0;

  let pendingFine = 0;

  for (const member of register.rows) {
    if (
      member.pendingFine <= 0
    ) {
      continue;
    }

    /**
     * Load attendance fine ledger
     * to determine the oldest
     * pending fine.
     */
    const ledger =
      await getMemberAttendanceFine(
        financialYearId,
        member.memberId,
      );

    const oldestPending =
      ledger.entries.find(
        (entry) =>
          entry.pendingFine > 0,
      );

    rows.push({
      memberId:
        member.memberId,

      memberCode:
        member.memberCode,

      memberName:
        member.memberName,

      presentCount:
        member.presentCount,

      absentCount:
        member.absentCount,

      leaveCount:
        member.leaveCount,

      attendancePercentage:
        member.attendancePercentage,

      totalFine:
        member.totalFine,

      paidFine:
        member.paidFine,

      pendingFine:
        member.pendingFine,

      oldestPendingDate:
        oldestPending
          ?.meetingDate ??
        null,
    });

    totalFine +=
      member.totalFine;

    paidFine +=
      member.paidFine;

    pendingFine +=
      member.pendingFine;
  }

  rows.sort(
    (a, b) => {
      if (
        a.pendingFine !==
        b.pendingFine
      ) {
        return (
          b.pendingFine -
          a.pendingFine
        );
      }

      if (
        a.oldestPendingDate &&
        b.oldestPendingDate
      ) {
        return (
          a.oldestPendingDate.getTime() -
          b.oldestPendingDate.getTime()
        );
      }

      return a.memberCode.localeCompare(
        b.memberCode,
      );
    },
  );

  return {
    rows,

    totals: {
      members:
        rows.length,

      totalFine,

      paidFine,

      pendingFine,
    },
  };
}