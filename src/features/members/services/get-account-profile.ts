import type { AccountProfile } from "../types";

import { resolveMemberForUser } from "./internal/resolve-member-for-user";

export async function getAccountProfile(userId: string): Promise<AccountProfile> {
  const { member } = await resolveMemberForUser(userId);

  return {
    memberId: member._id.toString(),
    memberCode: member.memberCode,
    name: member.name,
    phone: member.phone ?? "",
    address: member.address ?? "",
  };
}
