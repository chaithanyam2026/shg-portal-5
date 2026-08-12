import { Types } from "mongoose";

import type { MemberOpeningBalance as PersistedMemberOpeningBalance } from "@/models/FinancialYear";

import type { MemberOpeningBalance } from "../../domain";

export function mapMemberOpeningBalanceForPersistence(
  member: MemberOpeningBalance,
): PersistedMemberOpeningBalance {
  const memberCode = member.memberCode?.trim() ?? "";
  const memberName = member.memberName?.trim() ?? "";

  if (!memberCode || !memberName) {
    throw new Error(
      `Member opening balance is missing member details for member ${member.memberId}.`,
    );
  }

  return {
    memberId: new Types.ObjectId(member.memberId),
    memberCode,
    memberName,
    savings: member.savings ?? 0,
    loan: member.loanOutstanding ?? 0,
    interest: member.interestReceivable ?? 0,
    fine: member.fineOutstanding ?? 0,
    other: member.shareCapital ?? 0,
  };
}

export function mapMemberOpeningBalancesForPersistence(
  members: MemberOpeningBalance[],
): PersistedMemberOpeningBalance[] {
  return members.map(mapMemberOpeningBalanceForPersistence);
}
