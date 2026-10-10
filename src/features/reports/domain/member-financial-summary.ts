export type MemberFinancialSummaryRow = {
  memberId: string;

  memberCode: string;

  memberName: string;

  contributionExpected: number;

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
  contributionExpected: number;

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

  openingContribution: number;

  closedMeetingCount: number;

  weeklyContribution: number;

  expectedContribution: number;
};

export function getFinancialYearLoanInterestIncomeTotal(
  totals: MemberFinancialSummaryTotals,
): number {
  return totals.loanInterestPaid + totals.loanInterestPending;
}

export function getFinancialYearLoanFineIncomeTotal(totals: MemberFinancialSummaryTotals): number {
  return totals.loanFinePaid + totals.loanFinePending;
}

export function getFinancialYearAbsentFineIncomeTotal(
  totals: MemberFinancialSummaryTotals,
): number {
  return totals.absentFinePaid + totals.absentFinePending;
}
