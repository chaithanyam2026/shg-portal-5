import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";
import type { FinancialYearDocument, FinancialYearMemberOpening } from "@/models/FinancialYear";
import type { Types } from "mongoose";

import type { MemberPassbook } from "../domain";

import { buildMemberPassbook } from "./internal/member-passbook";

type PopulatedFinancialYearMember = {
  memberId: {
    _id: Types.ObjectId;
    memberCode: string;
    name: string;
  };
  opening: FinancialYearMemberOpening;
};

type PopulatedFinancialYear = Omit<FinancialYearDocument, "members"> & {
  members: PopulatedFinancialYearMember[];
};

/**
 * Returns the contribution passbook
 * for a member.
 */
export async function getMemberPassbook(memberId: string): Promise<MemberPassbook> {
  await connectMongo();

  const financialYear = await FinancialYear.findOne({
    "members.memberId": memberId,
    status: "IN_PROGRESS",
  })
    .populate({
      path: "members.memberId",
      select: "memberCode name",
    })
    .lean<PopulatedFinancialYear>();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  const member = financialYear.members.find(
    (member) => member.memberId._id.toString() === memberId,
  );

  if (!member) {
    throw new Error("Member not found.");
  }

  const meetings = await Meeting.find({
    financialYearId: financialYear._id,

    status: "CLOSED",
  })
    .select({
      meetingDate: 1,
      payments: 1,
    })
    .sort({
      meetingDate: 1,
    })
    .lean();

  return buildMemberPassbook({
    memberId,

    memberCode: member.memberId.memberCode,

    memberName: member.memberId.name,

    financialYearId: financialYear._id.toString(),

    financialYearName: financialYear.name,

    startDate: financialYear.startDate,

    openingContribution: member.opening?.contribution ?? 0,

    meetings,
  });
}
