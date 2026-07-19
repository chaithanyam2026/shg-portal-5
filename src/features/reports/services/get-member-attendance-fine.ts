import connectMongo from "@/lib/db/mongodb";

import type { AttendanceFineSummary } from "../domain";

import { buildAttendanceFineLedger } from "./internal/build-attendance-fine-ledger";

import { loadAttendanceFinePayments } from "./internal/load-attendance-fine-payments";

import { loadAttendanceMembers } from "./internal/load-attendance-members";

import { loadAttendanceMeetings } from "./internal/load-attendance-meetings";

/**
 * Returns the attendance fine
 * ledger for a single member.
 */
export async function getMemberAttendanceFine(
  financialYearId: string,
  memberId: string,
): Promise<AttendanceFineSummary> {
  await connectMongo();

  /**
   * Load financial year members.
   */
  const members = await loadAttendanceMembers(financialYearId);

  /**
   * Find requested member.
   */
  const member = members.find((member) => member.memberId === memberId);

  if (!member) {
    throw new Error("Member not found in the financial year.");
  }

  /**
   * Load meetings.
   */
  const meetings = await loadAttendanceMeetings(financialYearId);

  /**
   * Load attendance fine payments.
   */
  const payments = await loadAttendanceFinePayments(financialYearId);

  /**
   * Build attendance history for
   * the requested member.
   */
  const attendanceMember = {
    memberId: member.memberId,

    memberCode: member.memberCode,

    memberName: member.memberName,

    meetings: meetings.map((meeting) => ({
      meetingId: meeting.meetingId,

      meetingDate: meeting.meetingDate,

      status: meeting.attendance.get(member.memberId) ?? "PRESENT",

      finePaid:
        payments.find(
          (payment) =>
            payment.memberId === member.memberId && payment.meetingId === meeting.meetingId,
        )?.finePaid ?? 0,
    })),
  };

  const ledger = buildAttendanceFineLedger([attendanceMember]);

  return ledger[0];
}
