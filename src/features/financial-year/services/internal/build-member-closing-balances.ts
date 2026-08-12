import type {
  FinancialYearClosingMember,
} from "@/models/FinancialYear";

export interface BuildMemberClosingBalanceInput {
  memberId: FinancialYearClosingMember["memberId"];

  memberCode: string;

  memberName: string;

  savingsBalance: number;

  loanOutstanding: number;

  specialLoanOutstanding: number;

  attendanceFineOutstanding: number;

  loanFineOutstanding: number;
}

function buildMemberClosingBalance(
  input: BuildMemberClosingBalanceInput,
): FinancialYearClosingMember {
  const totalOutstanding =
    input.loanOutstanding +
    input.specialLoanOutstanding +
    input.attendanceFineOutstanding +
    input.loanFineOutstanding;

  return {
    memberId: input.memberId,

    memberCode: input.memberCode,

    memberName: input.memberName,

    savingsBalance: input.savingsBalance,

    loanOutstanding: input.loanOutstanding,

    specialLoanOutstanding:
      input.specialLoanOutstanding,

    attendanceFineOutstanding:
      input.attendanceFineOutstanding,

    loanFineOutstanding:
      input.loanFineOutstanding,

    totalOutstanding,
  };
}

export function buildMemberClosingBalances(
  members: BuildMemberClosingBalanceInput[],
): FinancialYearClosingMember[] {
  return members.map(
    buildMemberClosingBalance,
  );
}