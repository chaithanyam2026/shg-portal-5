import type { AccountProfile } from "../types";

import { resolveMemberForUser } from "./internal/resolve-member-for-user";
import { CACHE_TAGS, remember } from "@/lib/cache";

async function queryAccountProfile(userId: string): Promise<AccountProfile> {
  const { member } = await resolveMemberForUser(userId);

  return {
    memberId: member._id.toString(),
    memberCode: member.memberCode,
    name: member.name,
    phone: member.phone ?? "",
    address: member.address ?? "",
  };
}

export const getAccountProfile = remember(queryAccountProfile, {
  key: "account-profile",
  tags: [CACHE_TAGS.members],
  revalidate: 60,
});
