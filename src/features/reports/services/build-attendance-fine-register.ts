import connectMongo from "@/lib/db/mongodb";

import type {
  AttendanceFineRegister,
  AttendanceFineRegisterRow,
} from "../domain/attendance-fine-register";

import { buildAttendanceFineLedger } from "./internal/build-attendance-fine-ledger";

import { loadAttendanceFinePayments } from "./internal/load-attendance-fine-payments";

import { loadAttendanceMembers } from "./internal/load-attendance-members";

import { loadAttendanceMeetings } from "./internal/load-attendance-meetings";

/**
 * Builds the Attendance Fine
 * Register for a financial year.
 */
export async function buildAttendanceFineRegister(
  financialYearId?: string,
): Promise<AttendanceFineRegister> {
  await connectMongo();

  /**
   * Load members.
   */
  const members = await loadAttendanceMembers(financialYearId);

  /**
   * Load CLOSED meetings.
   */
  const meetings = await loadAttendanceMeetings(financialYearId);

  /**
   * Load attendance fine
   * payments.
   */
  const payments = await loadAttendanceFinePayments(financialYearId);

  /**
   * Build attendance member
   * input for ledger.
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
   * Build attendance fine
   * ledger.
   */
  const ledger = buildAttendanceFineLedger(attendanceMembers);

  const rows: AttendanceFineRegisterRow[] = ledger.map((member) => ({
    memberId: member.memberId,

    memberCode: member.memberCode,

    memberName: member.memberName,

    presentCount: member.presentCount,

    absentCount: member.absentCount,

    leaveCount: member.leaveCount,

    attendancePercentage: member.attendancePercentage,

    totalFine: member.totalFine,

    paidFine: member.paidFine,

    pendingFine: member.pendingFine,
  }));

  rows.sort((a, b) => a.memberCode.localeCompare(b.memberCode));

  const totals = rows.reduce(
    (totals, row) => {
      totals.totalFine += row.totalFine;

      totals.paidFine += row.paidFine;

      totals.pendingFine += row.pendingFine;

      return totals;
    },
    {
      totalFine: 0,
      paidFine: 0,
      pendingFine: 0,
    },
  );

  return {
    rows,

    totals,
  };
}
