import connectMongo from "@/lib/db/mongodb";
import { CACHE_TAGS, remember } from "@/lib/cache";

import Member from "@/models/Member";

import type { MemberLookup } from "../types";

async function queryFinancialYearMembers(): Promise<MemberLookup[]> {
  await connectMongo();

  const members = await Member.find()
    .select({
      memberCode: 1,
      name: 1,
    })
    .sort({
      memberCode: 1,
    })
    .lean();

  return members.map((member) => ({
    _id: member._id.toString(),
    memberCode: member.memberCode,
    name: member.name,
  }));
}

export const listMembers = remember(queryFinancialYearMembers, {
  key: "financial-year-member-lookup",
  tags: [CACHE_TAGS.members],
  revalidate: 60,
});
