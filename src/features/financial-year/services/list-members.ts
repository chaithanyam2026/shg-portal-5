import connectMongo from "@/lib/db/mongodb";

import Member from "@/models/Member";

export async function listMembers() {
  await connectMongo();

  return Member.find()
    .select({
      memberCode: 1,
      name: 1,
    })
    .sort({
      memberCode: 1,
    })
    .lean();
}
