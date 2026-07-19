import type { MemberLookup } from "../../types";

import type { PopulatedMember } from "./types";

export function mapCommitteeMember(
  member: PopulatedMember | null,
): MemberLookup | null {
  if (!member) {
    return null;
  }

  return {
    _id: member._id.toString(),

    memberCode: member.memberCode,

    name: member.name,
  };
}