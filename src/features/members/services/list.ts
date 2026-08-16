import connectMongo from "@/lib/db/mongodb";
import { CACHE_TAGS, remember } from "@/lib/cache";

import Member from "@/models/Member";

import type { MemberSummary } from "../types";

async function queryMembers(): Promise<MemberSummary[]> {
  await connectMongo();

  const members = await Member.find()
    .sort({
      memberCode: 1,
    })
    .lean();

  return members.map((member) => ({
    _id: member._id.toString(),

    memberCode: member.memberCode,

    name: member.name,

    phone: member.phone,

    address: member.address,

    status: member.active ? "ACTIVE" : "INACTIVE",

    joinedDate: member.joinDate?.toISOString(),

    deactivatedDate: member.deactivatedDate?.toISOString(),

    remarks: member.remarks ?? "",
  }));
}

/**
 * Returns all members ordered by
 * member code.
 */
export const listMembers = remember(queryMembers, {
  key: "members-list",
  tags: [CACHE_TAGS.members],
  revalidate: 60,
});
