import type {
  FinancialYearClosing,
  FinancialYearClosingMember,
} from "@/models/FinancialYear";

import type { MemberOpeningBalance } from "../../domain";

function buildMemberOpeningBalance(
  member: FinancialYearClosingMember,
): MemberOpeningBalance {
  return {
    memberId: member.memberId.toString(),

    memberCode: member.memberCode,

    memberName: member.memberName,

    savings: member.savingsBalance,

    loan: member.loanOutstanding + member.specialLoanOutstanding,

    interest: 0,

    fine: member.attendanceFineOutstanding + member.loanFineOutstanding,

    other: 0,
  };
}

export function buildMemberOpeningBalances(
  closing: FinancialYearClosing,
): MemberOpeningBalance[] {
  return closing.members.map(buildMemberOpeningBalance);
}
