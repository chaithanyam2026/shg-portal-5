import Member from "@/models/Member";
import type { FinancialYearDocument } from "@/models/FinancialYear";

import type { MemberOpeningBalance } from "../../domain";

type MemberLookup = {
  memberCode: string;
  memberName: string;
};

function isPopulatedMemberRef(
  value: unknown,
): value is { _id: { toString(): string }; memberCode: string; name: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "_id" in value &&
    "memberCode" in value &&
    "name" in value
  );
}

export async function enrichMemberOpeningBalances(
  members: MemberOpeningBalance[],
  sourceFinancialYear?: FinancialYearDocument | null,
): Promise<MemberOpeningBalance[]> {
  const lookup = new Map<string, MemberLookup>();

  if (sourceFinancialYear) {
    for (const member of sourceFinancialYear.members) {
      const ref = member.memberId;

      if (isPopulatedMemberRef(ref)) {
        lookup.set(ref._id.toString(), {
          memberCode: ref.memberCode,
          memberName: ref.name,
        });
      }
    }
  }

  const missingIds = members
    .filter((member) => !member.memberCode?.trim() || !member.memberName?.trim())
    .map((member) => member.memberId);

  if (missingIds.length > 0) {
    const dbMembers = await Member.find(
      { _id: { $in: missingIds } },
      { memberCode: 1, name: 1 },
    ).lean();

    for (const dbMember of dbMembers) {
      lookup.set(dbMember._id.toString(), {
        memberCode: dbMember.memberCode,
        memberName: dbMember.name,
      });
    }
  }

  return members.map((member) => {
    const details = lookup.get(member.memberId);

    return {
      ...member,
      memberCode: member.memberCode?.trim() || details?.memberCode || "",
      memberName: member.memberName?.trim() || details?.memberName || "",
    };
  });
}
