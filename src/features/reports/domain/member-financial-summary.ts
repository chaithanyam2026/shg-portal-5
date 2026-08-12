export type MemberFinancialSummaryRow = {
  memberId: string;

  memberCode: string;

  memberName: string;

  contributionPaid: number;

  contributionToBePaid: number;

  outstandingLoan: number;

  outstandingSpecialLoan: number;

  specialLoanExpiry: string | null;

  loanInterestPaid: number;

  loanInterestPending: number;

  loanFinePaid: number;

  loanFinePending: number;

  absentFinePaid: number;

  absentFinePending: number;
};

export type MemberFinancialSummaryTotals = {
  contributionPaid: number;

  contributionToBePaid: number;

  outstandingLoan: number;

  outstandingSpecialLoan: number;

  loanInterestPaid: number;

  loanInterestPending: number;

  loanFinePaid: number;

  loanFinePending: number;

  absentFinePaid: number;

  absentFinePending: number;
};

export type MemberFinancialSummary = {
  rows: MemberFinancialSummaryRow[];

  totals: MemberFinancialSummaryTotals;
};
