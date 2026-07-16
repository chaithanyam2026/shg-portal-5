import type {
  AttendanceStatus,
} from "@/features/meetings/domain/attendance-status";

/**
 * Meeting column.
 */
export type AttendanceRegisterMeeting = {
  meetingId: string;

  meetingDate: Date;
};

/**
 * Attendance cell.
 */
export type AttendanceRegisterCell = {
  meetingId: string;

  status: AttendanceStatus;
};

/**
 * Member attendance row.
 */
export type AttendanceRegisterRow = {
  memberId: string;

  memberCode: string;

  memberName: string;

  attendance: AttendanceRegisterCell[];

  presentCount: number;

  absentCount: number;

  leaveCount: number;

  attendancePercentage: number;
};

/**
 * Meeting summary.
 */
export type AttendanceRegisterMeetingSummary =
  {
    meetingId: string;

    meetingDate: Date;

    presentCount: number;

    absentCount: number;

    leaveCount: number;

    attendancePercentage: number;
  };

/**
 * Attendance register.
 */
export type AttendanceRegister = {
  financialYearId: string;

  financialYearName: string;

  meetings:
    AttendanceRegisterMeeting[];

  rows:
    AttendanceRegisterRow[];

  meetingSummary:
    AttendanceRegisterMeetingSummary[];

  totalMembers: number;
};