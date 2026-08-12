import type { AttendanceStatus } from "../../domain";

export type AttendanceMeeting = {
  meetingId: string;

  meetingDate: Date;

  status: AttendanceStatus;

  finePaid: number;
};

export type AttendanceMember = {
  memberId: string;

  memberCode: string;

  memberName: string;

  meetings: AttendanceMeeting[];
};
