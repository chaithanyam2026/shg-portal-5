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

/**
 * Admins see every year. President, secretary, and treasurer see every
 * member only in the financial years where they hold that role.
 */
export function canViewAllLoansForFinancialYear(input: {
  financialYearId?: string | null;
  canViewAllFinancialYears: boolean;
  officeBearerFinancialYearIds: readonly string[];
}): boolean {
  if (input.canViewAllFinancialYears) {
    return true;
  }

  if (!input.financialYearId) {
    return false;
  }

  return input.officeBearerFinancialYearIds.includes(input.financialYearId);
}
