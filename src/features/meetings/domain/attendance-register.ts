export type AttendanceMeeting = {
  meetingId: string;

  meetingDate: Date;
};

export type AttendanceRow = {
  memberId: string;

  memberCode: string;

  memberName: string;

  attendance: Record<string, "PRESENT" | "ABSENT">;

  presentCount: number;

  absentCount: number;

  attendancePercentage: number;
};

export type AttendanceRegister = {
  financialYearId: string;

  financialYearName: string;

  meetings: AttendanceMeeting[];

  rows: AttendanceRow[];
};
