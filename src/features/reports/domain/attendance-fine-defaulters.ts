export type AttendanceFineDefaulter = {
  memberId: string;

  memberCode: string;

  memberName: string;

  presentCount: number;

  absentCount: number;

  leaveCount: number;

  attendancePercentage: number;

  totalFine: number;

  paidFine: number;

  pendingFine: number;

  /**
   * Oldest unpaid attendance
   * fine date.
   */
  oldestPendingDate: Date | null;
};

export type AttendanceFineDefaultersReport = {
  rows: AttendanceFineDefaulter[];

  totals: {
    members: number;

    totalFine: number;

    paidFine: number;

    pendingFine: number;
  };
};
