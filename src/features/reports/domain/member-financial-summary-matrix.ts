import type { MemberFinancialSummaryRow, MemberFinancialSummaryTotals } from "./member-financial-summary";

export function getMemberContributionTotal(row: MemberFinancialSummaryRow): number {
  return row.contributionPaid + row.contributionToBePaid;
}

export function getMemberLoanTotal(row: MemberFinancialSummaryRow): number {
  return (
    row.outstandingLoan +
    row.contributionToBePaid +
    row.loanInterestPending +
    row.loanFinePending +
    row.absentFinePending
  );
}

export function getTotalsContributionTotal(totals: MemberFinancialSummaryTotals): number {
  return totals.contributionPaid + totals.contributionToBePaid;
}

export function getTotalsLoanTotal(totals: MemberFinancialSummaryTotals): number {
  return (
    totals.outstandingLoan +
    totals.contributionToBePaid +
    totals.loanInterestPending +
    totals.loanFinePending +
    totals.absentFinePending
  );
}
