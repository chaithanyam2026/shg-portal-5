import FinancialYear from "@/models/FinancialYear";

export async function loadFinancialYearMembers(financialYearId: string) {
  const financialYear = await FinancialYear.findById(financialYearId)
    .populate({
      path: "members.memberId",
      select: "memberCode name",
    })
    .lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  return financialYear.members.map((member) => ({
    _id: member.memberId._id.toString(),

    memberCode: member.memberId.memberCode,

    name: member.memberId.name,
  }));
}
