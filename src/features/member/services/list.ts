import connectMongo from "@/lib/db/mongodb";
import Member from "@/models/Member";

export async function list() {
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

return members.map((member) => ({
  _id: member._id.toString(),
  memberCode: member.memberCode,
  name: member.name,
}));
}