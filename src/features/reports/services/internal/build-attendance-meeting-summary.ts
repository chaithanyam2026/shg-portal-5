import type { AttendanceRegister, AttendanceRegisterMeetingSummary } from "../../domain";

/**
 * Builds the footer summary for
 * every meeting column.
 */
export function buildAttendanceMeetingSummary(
  register: Pick<AttendanceRegister, "meetings" | "rows">,
): AttendanceRegisterMeetingSummary[] {
  return register.meetings.map((meeting) => {
    let presentCount = 0;

    let absentCount = 0;

    let leaveCount = 0;

    let fineGenerated = 0;

    for (const row of register.rows) {
      const attendance = row.attendance.find((cell) => cell.meetingId === meeting.meetingId);

      if (!attendance) {
        continue;
      }

      switch (attendance.status) {
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

      fineGenerated += attendance.fineCharged;
    }

    return {
      meetingId: meeting.meetingId,

      meetingDate: meeting.meetingDate,

      presentCount,

      absentCount,

      leaveCount,

      fineGenerated,
    };
  });
}
