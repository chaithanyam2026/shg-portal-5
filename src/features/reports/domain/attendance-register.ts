import type {
  AttendanceStatus,
} from "./attendance-fine";

/**
 * One meeting column.
 */
export type AttendanceRegisterMeeting = {
  meetingId: string;

  meetingDate: Date;
};

/**
 * Cell shown inside the register.
 */
export type AttendanceRegisterCell = {
  meetingId: string;

  meetingDate: Date;

  status: AttendanceStatus;

  /**
   * Consecutive absence after
   * this meeting.
   */
  consecutiveAbsence: number;

  /**
   * Fine generated during
   * this meeting.
   */
  fineCharged: number;

  /**
   * Running outstanding fine
   * after this meeting.
   */
  pendingFine: number;

  /**
   * Fine paid during
   * this meeting.
   */
  finePaid: number;
};

/**
 * One member row.
 */
export type AttendanceRegisterRow = {
  memberId: string;

  memberCode: string;

  memberName: string;

  attendance: AttendanceRegisterCell[];

  totalFine: number;

  paidFine: number;

  pendingFine: number;
};

/**
 * Totals displayed in footer for
 * each meeting column.
 */
export type AttendanceRegisterMeetingSummary =
  {
    meetingId: string;

    meetingDate: Date;

    presentCount: number;

    absentCount: number;

    leaveCount: number;

    fineGenerated: number;
  };

/**
 * Complete register.
 */
export type AttendanceRegister = {
  meetings:
    AttendanceRegisterMeeting[];

  rows:
    AttendanceRegisterRow[];

  summary:
    AttendanceRegisterMeetingSummary[];
};