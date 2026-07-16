import connectMongo from "@/lib/db/mongodb";

import type {
  AttendanceFineCollectionReport,
  AttendanceFineCollectionRow,
} from "../domain/attendance-fine-collection";

import {
  buildAttendanceFineLedger,
} from "./internal/build-attendance-fine-ledger";

import {
  loadAttendanceFinePayments,
} from "./internal/load-attendance-fine-payments";

import {
  loadAttendanceMeetings,
} from "./internal/load-attendance-meetings";

import {
  loadAttendanceMembers,
} from "./internal/load-attendance-members";

/**
 * Builds the Attendance Fine
 * Collection report.
 */
export async function buildAttendanceFineCollection(
  financialYearId?: string,
): Promise<AttendanceFineCollectionReport> {
  await connectMongo();

  /**
   * Load report data.
   */
  const [
    members,
    meetings,
    payments,
  ] = await Promise.all([
    loadAttendanceMembers(
      financialYearId,
    ),

    loadAttendanceMeetings(
      financialYearId,
    ),

    loadAttendanceFinePayments(
      financialYearId,
    ),
  ]);

  /**
   * Build attendance input.
   */
  const attendanceMembers =
    members.map((member) => ({
      memberId:
        member.memberId,

      memberCode:
        member.memberCode,

      memberName:
        member.memberName,

      meetings: meetings.map(
        (meeting) => ({
          meetingId:
            meeting.meetingId,

          meetingDate:
            meeting.meetingDate,

          status:
            meeting.attendance.get(
              member.memberId,
            ) ?? "PRESENT",

          finePaid:
            payments.find(
              (payment) =>
                payment.memberId ===
                  member.memberId &&
                payment.meetingId ===
                  meeting.meetingId,
            )?.finePaid ?? 0,
        }),
      ),
    }));

  /**
   * Member ledgers.
   */
  const ledger =
    buildAttendanceFineLedger(
      attendanceMembers,
    );

  /**
   * Running balance.
   */
  let runningPending = 0;

  const rows:
    AttendanceFineCollectionRow[] =
    meetings.map(
      (meeting) => {
        let presentCount = 0;

        let absentCount = 0;

        let leaveCount = 0;

        let generatedFine = 0;

        let collectedFine = 0;

        for (const member of ledger) {
          const entry =
            member.entries.find(
              (item) =>
                item.meetingId ===
                meeting.meetingId,
            );

          if (!entry) {
            continue;
          }

          switch (
            entry.status
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

          generatedFine +=
            entry.fineCharged;

          collectedFine +=
            entry.finePaid;
        }

        runningPending +=
          generatedFine;

        runningPending -=
          collectedFine;

        return {
          meetingId:
            meeting.meetingId,

          meetingDate:
            meeting.meetingDate,

          presentCount,

          absentCount,

          leaveCount,

          generatedFine,

          collectedFine,

          pendingFine:
            runningPending,
        };
      },
    );

  const totals =
    rows.reduce(
      (
        totals,
        row,
      ) => {
        totals.generatedFine +=
          row.generatedFine;

        totals.collectedFine +=
          row.collectedFine;

        totals.pendingFine =
          row.pendingFine;

        return totals;
      },
      {
        generatedFine: 0,

        collectedFine: 0,

        pendingFine: 0,
      },
    );

  return {
    rows,

    totals,
  };
}