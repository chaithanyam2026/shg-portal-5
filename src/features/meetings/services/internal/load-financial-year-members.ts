import FinancialYear from "@/models/FinancialYear";
import type { FinancialYearDocument } from "@/models/FinancialYear";
import type { Types } from "mongoose";

type PopulatedFinancialYearMember = {
  memberId: {
    _id: Types.ObjectId;
    memberCode: string;
    name: string;
  };
};

type PopulatedFinancialYear = Omit<FinancialYearDocument, "members"> & {
  members: PopulatedFinancialYearMember[];
};

export async function loadFinancialYearMembers(financialYearId: string) {
  const financialYear = await FinancialYear.findById(financialYearId)
    .populate({
      path: "members.memberId",
      select: "memberCode name",
    })
    .lean<PopulatedFinancialYear>();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  return financialYear.members.map((member) => ({
    _id: member.memberId._id.toString(),

    memberCode: member.memberId.memberCode,

    name: member.memberId.name,
  }));
}
