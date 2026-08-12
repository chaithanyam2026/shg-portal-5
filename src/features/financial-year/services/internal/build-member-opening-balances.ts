import type {
  FinancialYearClosing,
  FinancialYearClosingMember,
} from "@/models/FinancialYear";

import type { MemberOpeningBalance } from "../../domain";

function buildMemberOpeningBalance(
  member: FinancialYearClosingMember,
): MemberOpeningBalance {
  const loanOutstanding = member.loanOutstanding ?? 0;
  const specialLoanOutstanding = member.specialLoanOutstanding ?? 0;
  const attendanceFineOutstanding = member.attendanceFineOutstanding ?? 0;
  const loanFineOutstanding = member.loanFineOutstanding ?? 0;

  return {
    memberId: member.memberId.toString(),

    memberCode: member.memberCode ?? "",

    memberName: member.memberName ?? "",

    savings: member.savingsBalance ?? 0,

    loanOutstanding: loanOutstanding + specialLoanOutstanding,

    interestReceivable: 0,

    fineOutstanding: attendanceFineOutstanding + loanFineOutstanding,

    shareCapital: 0,
  };
}

export function buildMemberOpeningBalances(
  closing: FinancialYearClosing,
): MemberOpeningBalance[] {
  return closing.members.map(buildMemberOpeningBalance);
}
