import type {
  AttendanceFineSummary,
  AttendanceRegister,
  AttendanceRegisterCell,
  AttendanceRegisterMeeting,
  AttendanceRegisterRow,
} from "../../domain";

import {
  buildAttendanceMeetingSummary,
} from "./build-attendance-meeting-summary";

type Meeting = {
  meetingId: string;

  meetingDate: Date;

  attendance: Map<
    string,
    "PRESENT" | "ABSENT" | "LEAVE"
  >;
};

type Member = {
  memberId: string;

  memberCode: string;

  memberName: string;
};

type BuildAttendanceRegisterInput = {
  meetings: Meeting[];

  members: Member[];

  fineLedger: AttendanceFineSummary[];
};

/**
 * Builds the attendance register.
 *
 * Business Rules
 * --------------
 * - One row per member
 * - One column per meeting
 * - Meeting cells display
 *   attendance status and
 *   fine generated.
 * - Total/Paid/Pending fine
 *   comes from Attendance Fine
 *   Ledger.
 */
export function buildAttendanceRegister({
  meetings,
  members,
  fineLedger,
}: BuildAttendanceRegisterInput): AttendanceRegister {
  /**
   * Sort meetings chronologically.
   */
  const sortedMeetings = [
    ...meetings,
  ].sort(
    (a, b) =>
      a.meetingDate.getTime() -
      b.meetingDate.getTime(),
  );

  /**
   * Attendance fine lookup.
   */
  const fineMap = new Map(
    fineLedger.map((ledger) => [
      ledger.memberId,
      ledger,
    ]),
  );

  /**
   * Meeting headers.
   */
  const registerMeetings: AttendanceRegisterMeeting[] =
    sortedMeetings.map(
      (meeting) => ({
        meetingId:
          meeting.meetingId,

        meetingDate:
          meeting.meetingDate,
      }),
    );

  /**
   * Register rows.
   */
  const rows: AttendanceRegisterRow[] =
    members.map((member) => {
      const ledger =
        fineMap.get(
          member.memberId,
        );

      /**
       * Quick lookup by meeting.
       */
      const entryMap = new Map(
        (
          ledger?.entries ??
          []
        ).map((entry) => [
          entry.meetingId,
          entry,
        ]),
      );

      const attendance: AttendanceRegisterCell[] =
        sortedMeetings.map(
          (meeting) => {
            const entry =
              entryMap.get(
                meeting.meetingId,
              );

            return {
              meetingId:
                meeting.meetingId,

              meetingDate:
                meeting.meetingDate,

              status:
                entry?.status ??
                "PRESENT",

              consecutiveAbsence:
                entry?.consecutiveAbsence ??
                0,

              fineCharged:
                entry?.fineCharged ??
                0,

              finePaid:
                entry?.finePaid ??
                0,

              pendingFine:
                entry?.pendingFine ??
                0,
            };
          },
        );

      return {
        memberId:
          member.memberId,

        memberCode:
          member.memberCode,

        memberName:
          member.memberName,

        attendance,

        totalFine:
          ledger?.totalFine ??
          0,

        paidFine:
          ledger?.paidFine ??
          0,

        pendingFine:
          ledger?.pendingFine ??
          0,
      };
    });

  /**
   * Meeting footer summary.
   */
  const summary =
    buildAttendanceMeetingSummary({
      meetings:
        registerMeetings,

      rows,
    });

  return {
    meetings:
      registerMeetings,

    rows,

    summary,
  };
}