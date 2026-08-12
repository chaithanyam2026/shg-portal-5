import connectMongo from "@/lib/db/mongodb";

import Member from "@/models/Member";

import type { MemberSummary } from "../types";

/**
 * Returns all members ordered by
 * member code.
 */
export async function listMembers(): Promise<MemberSummary[]> {
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

    remarks: member.remarks ?? "",
  }));
}
