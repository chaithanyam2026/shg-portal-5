import connectMongo from "@/lib/db/mongodb";

import type { AttendanceRegister } from "../domain";

import { buildAttendanceFineLedger } from "./internal/build-attendance-fine-ledger";

import { buildAttendanceRegister as buildRegister } from "./internal/build-attendance-register";

import { loadAttendanceFinePayments } from "./internal/load-attendance-fine-payments";

import { loadAttendanceMembers } from "./internal/load-attendance-members";

import { loadAttendanceMeetings } from "./internal/load-attendance-meetings";

/**
 * Builds the complete attendance
 * register for a financial year.
 */
export async function buildAttendanceRegister(
  financialYearId?: string,
): Promise<AttendanceRegister> {
  await connectMongo();

  /**
   * Members belonging to the
   * financial year.
   */
  const members = await loadAttendanceMembers(financialYearId);

  /**
   * CLOSED meetings ordered by
   * meeting date.
   */
  const meetings = await loadAttendanceMeetings(financialYearId);

  /**
   * Attendance fine payments
   * collected during meetings.
   */
  const payments = await loadAttendanceFinePayments(financialYearId);

  /**
   * Merge attendance with
   * attendance fine payments.
   */
  const attendanceMembers = members.map((member) => ({
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
  }));

  /**
   * Build attendance fine ledger.
   */
  const fineLedger = buildAttendanceFineLedger(attendanceMembers);

  /**
   * Build attendance register.
   */
  return buildRegister({
    meetings,

    members,

    fineLedger,
  });
}
