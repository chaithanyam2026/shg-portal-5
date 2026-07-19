import type {
  FinancialYearClosing,
  FinancialYearClosingMember,
  FinancialYearMemberOpening,
} from "@/models/FinancialYear";

function buildMemberOpeningBalance(
  member: FinancialYearClosingMember,
): FinancialYearMemberOpening {
  return {
    memberId: member.memberId,

    contribution: member.savingsBalance,

    loan: member.loanOutstanding,

    specialLoan: member.specialLoanOutstanding,

    specialLoanExpiry: null,
  };
}

export function buildMemberOpeningBalances(
  closing: FinancialYearClosing,
): FinancialYearMemberOpening[] {
  return closing.members.map(buildMemberOpeningBalance);
}