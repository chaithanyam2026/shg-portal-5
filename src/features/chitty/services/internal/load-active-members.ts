import Member from "@/models/Member";

export async function loadActiveChittyMembers() {
  const members = await Member.find({ active: true })
    .select("memberCode name")
    .sort({ name: 1 })
    .lean();

  return members.map((member) => ({
    memberId: member._id.toString(),
    memberCode: member.memberCode,
    memberName: member.name,
  }));
}
