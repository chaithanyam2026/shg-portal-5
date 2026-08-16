export function canViewLoanDetails(input: {
  loanMemberId: string;
  currentMemberId?: string | null;
  canViewAllLoans: boolean;
}): boolean {
  if (input.canViewAllLoans) {
    return true;
  }

  return Boolean(input.currentMemberId && input.currentMemberId === input.loanMemberId);
}
