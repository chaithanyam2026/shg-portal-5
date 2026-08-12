export type AttendanceFineRegisterRow = {
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
};

export type AttendanceFineRegister = {
  rows: AttendanceFineRegisterRow[];

  totals: {
    totalFine: number;

    paidFine: number;

    pendingFine: number;
  };
};
