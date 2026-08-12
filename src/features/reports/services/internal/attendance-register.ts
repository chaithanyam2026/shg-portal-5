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
    }

    const denominator = presentCount + absentCount;

    return {
      meetingId: meeting.meetingId,

      meetingDate: meeting.meetingDate,

      presentCount,

      absentCount,

      leaveCount,

      fineGenerated: 0,
    };
  });

  const rows = sortedMembers.map((member): AttendanceRegisterRow => {
    let presentCount = 0;

    let absentCount = 0;

    let leaveCount = 0;

    const attendance: AttendanceRegisterCell[] = [];

    for (const meeting of sortedMeetings) {
      const record = meeting.attendance.find((item) => item.memberId === member.memberId);

      const status = record?.status ?? "ABSENT";

      attendance.push({
        meetingId: meeting.meetingId,

        meetingDate: meeting.meetingDate,

        status,

        consecutiveAbsence: 0,

        fineCharged: 0,

        pendingFine: 0,

        finePaid: 0,
      });

      switch (status) {
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
    }

    return {
      memberId: member.memberId,

      memberCode: member.memberCode,

      memberName: member.memberName,

      attendance,

      totalFine: 0,

      paidFine: 0,

      pendingFine: 0,
    };
  });

  return {
    meetings: sortedMeetings.map((meeting) => ({
      meetingId: meeting.meetingId,

      meetingDate: meeting.meetingDate,
    })),

    rows,

    summary: meetingSummary,
  };
}
