import { ATTENDANCE_STATUS } from "@/features/meetings/domain/attendance-status";

import type {
  AttendanceRegister,
  AttendanceRegisterBuilderInput,
  AttendanceRegisterCell,
  AttendanceRegisterMeetingSummary,
  AttendanceRegisterRow,
} from "../../domain";

/**
 * Builds the attendance register.
 */
export function buildAttendanceRegister({
  financialYearId,
  financialYearName,
  members,
  meetings,
}: AttendanceRegisterBuilderInput): AttendanceRegister {
  const sortedMembers = [...members].sort((a, b) => a.memberCode.localeCompare(b.memberCode));

  const sortedMeetings = [...meetings].sort(
    (a, b) => a.meetingDate.getTime() - b.meetingDate.getTime(),
  );

  const meetingSummary = sortedMeetings.map((meeting): AttendanceRegisterMeetingSummary => {
    let presentCount = 0;

    let absentCount = 0;

    let leaveCount = 0;

    for (const record of meeting.attendance) {
      switch (record.status) {
        case ATTENDANCE_STATUS.PRESENT:
          presentCount++;
          break;

        case ATTENDANCE_STATUS.ABSENT:
          absentCount++;
          break;

        case ATTENDANCE_STATUS.LEAVE:
          leaveCount++;
          break;
      }
    }

    const denominator = presentCount + absentCount;

    return {
      meetingId: meeting.meetingId,

      meetingDate: meeting.meetingDate,

      presentCount,

      absentCount,

      leaveCount,

      attendancePercentage:
        denominator === 0 ? 100 : Number(((presentCount * 100) / denominator).toFixed(2)),
    };
  });

  const rows = sortedMembers.map((member): AttendanceRegisterRow => {
    let presentCount = 0;

    let absentCount = 0;

    let leaveCount = 0;

    const attendance: AttendanceRegisterCell[] = [];

    for (const meeting of sortedMeetings) {
      const record = meeting.attendance.find((item) => item.memberId === member.memberId);

      const status = record?.status ?? ATTENDANCE_STATUS.ABSENT;

      attendance.push({
        meetingId: meeting.meetingId,

        status,
      });

      switch (status) {
        case ATTENDANCE_STATUS.PRESENT:
          presentCount++;
          break;

        case ATTENDANCE_STATUS.ABSENT:
          absentCount++;
          break;

        case ATTENDANCE_STATUS.LEAVE:
          leaveCount++;
          break;
      }
    }

    const denominator = presentCount + absentCount;

    return {
      memberId: member.memberId,

      memberCode: member.memberCode,

      memberName: member.memberName,

      attendance,

      presentCount,

      absentCount,

      leaveCount,

      attendancePercentage:
        denominator === 0 ? 100 : Number(((presentCount * 100) / denominator).toFixed(2)),
    };
  });

  return {
    financialYearId,

    financialYearName,

    meetings: sortedMeetings.map((meeting) => ({
      meetingId: meeting.meetingId,

      meetingDate: meeting.meetingDate,
    })),

    rows,

    meetingSummary,

    totalMembers: sortedMembers.length,
  };
}
