export type AttendanceFineCollectionRow = {
  meetingId: string;

  meetingDate: Date;

  presentCount: number;

  absentCount: number;

  leaveCount: number;

  generatedFine: number;

  collectedFine: number;

  pendingFine: number;
};

export type AttendanceFineCollectionReport =
  {
    rows:
      AttendanceFineCollectionRow[];

    totals: {
      generatedFine: number;

      collectedFine: number;

      pendingFine: number;
    };
  };