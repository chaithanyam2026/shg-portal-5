import connectMongo from "@/lib/db/mongodb";
import type { MemberLookup } from "@/features/financial-year/types";
import Member from "@/models/Member";

export async function list(): Promise<MemberLookup[]> {
  await connectMongo();

  /* return Member.find({
    active: true,
  })
    .select({
      memberCode: 1,
      name: 1,
    })
    .sort({
      memberCode: 1,
    })
    .lean()
    .exec(); */
  const members = await Member.find({
    active: true,
  })
    .select({
      memberCode: 1,
      name: 1,
    })
    .sort({
      memberCode: 1,
    })
    .lean()
    .exec();

  return members.map((member): MemberLookup => ({
    _id: member._id.toString(),
    memberCode: String(member.memberCode),
    name: String(member.name),
  }));
}
