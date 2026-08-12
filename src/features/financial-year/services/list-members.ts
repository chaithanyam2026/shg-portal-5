import connectMongo from "@/lib/db/mongodb";

import Member from "@/models/Member";

import type { MemberLookup } from "../types";

export async function listMembers(): Promise<MemberLookup[]> {
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
