/**
 * Attendance status recorded for
 * each meeting.
 */
export const ATTENDANCE_STATUSES = [
  "PRESENT",
  "ABSENT",
  "LEAVE",
] as const;

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUSES)[number];

/**
 * Fine generated for one meeting.
 */
export type AttendanceFineEntry = {
  meetingId: string;

  meetingDate: Date;

  status: AttendanceStatus;

  /**
   * Consecutive absence count after
   * processing this meeting.
   *
   * Present  -> 0
   * Leave    -> unchanged
   * Absent   -> incremented
   */
  consecutiveAbsence: number;

  /**
   * Fine charged for THIS meeting.
   *
   * Examples
   * --------
   * 1st absence = 10
   * 2nd absence = 20
   * 3rd absence = 70
   * 4th absence = 100
   */
  fineCharged: number;

  /**
   * Fine paid during this meeting.
   */
  finePaid: number;

  /**
   * Outstanding fine after this
   * meeting.
   */
  pendingFine: number;
};

/**
 * Attendance fine ledger of a member.
 */
export type AttendanceFineSummary = {
  memberId: string;

  memberCode: string;

  memberName: string;

  /**
   * Attendance statistics.
   */
  presentCount: number;

  absentCount: number;

  leaveCount: number;

  attendancePercentage: number;

  /**
   * Fine summary.
   */
  totalFine: number;

  paidFine: number;

  pendingFine: number;

  entries: AttendanceFineEntry[];
};