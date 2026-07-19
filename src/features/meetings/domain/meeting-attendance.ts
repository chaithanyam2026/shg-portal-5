import type { AttendanceStatus } from "./attendance-status";

export type MeetingAttendance = {
  memberId: string;

  status: AttendanceStatus;

  remarks?: string;
};
