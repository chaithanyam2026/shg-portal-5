import { getMemberYearEndBalances } from "@/features/reports/services/get-member-year-end-balances";

export type LoanMemberCloseBalances = {
  pendingContribution: number;
  pendingAbsentFine: number;
};

export async function getLoanMemberCloseBalances(
  memberId: string,
  financialYearId: string,
): Promise<LoanMemberCloseBalances> {
  const balances = await getMemberYearEndBalances(financialYearId, memberId);

  return {
    pendingContribution: balances.pendingContribution,
    pendingAbsentFine: balances.pendingAbsentFine,
  };
}
