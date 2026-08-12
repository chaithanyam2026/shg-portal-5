import connectMongo from "@/lib/db/mongodb";
import { Types } from "mongoose";

import FinancialYear from "@/models/FinancialYear";

export type AttendanceMember = {
  memberId: string;

  memberCode: string;

  memberName: string;
};

/**
 * Loads all members belonging to
 * a financial year.
 */
export async function loadAttendanceMembers(financialYearId: string): Promise<AttendanceMember[]> {
  await connectMongo();

  /*   const financialYear = await FinancialYear.findById(financialYearId)
      .populate({
        path: "members.memberId",
        select: "memberCode name",
      })
      .lean(); */
  const financialYear = await FinancialYear.findById(financialYearId)
    .populate<{
      members: {
        memberId: {
          _id: Types.ObjectId;
          memberCode: string;
          name: string;
        };
      }[];
    }>({
      path: "members.memberId",
      select: "memberCode name",
    })
    .lean();


  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  return financialYear.members.map((member) => {
    const memberDoc = member.memberId;

    return {
      memberId: memberDoc._id.toString(),

      memberCode: memberDoc.memberCode,

      memberName: memberDoc.name,
    };
  });
}
