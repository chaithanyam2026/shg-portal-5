export type MemberContributionPaymentEntry = {
  meetingId?: string;

  meetingDate: Date;

  description: string;

  expectedAmount: number;

  paidAmount: number;

  pendingAmount: number;
};

export type MemberContributionPayments = {
  memberId: string;

  memberCode: string;

  memberName: string;

  financialYearId: string;

  financialYearName: string;

  openingContribution: number;

  closedMeetingCount: number;

  weeklyContributionAmount: number;

  totalExpected: number;

  totalPaid: number;

  totalPending: number;

  entries: MemberContributionPaymentEntry[];
};
