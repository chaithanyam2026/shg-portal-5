import type { Types } from "mongoose";

import { WEEKLY_CONTRIBUTION } from "@/features/meetings/domain/payment";
import { buildMemberPassbook } from "@/features/members/services/internal/member-passbook";
import connectMongo from "@/lib/db/mongodb";
import type { FinancialYearMemberOpening } from "@/models/FinancialYear";
import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";

import {
  contributionToBePaid,
  expectedContributionAmount,
  standardOpeningContribution,
} from "../domain/expected-contribution";

import { buildAttendanceFineRegister } from "./build-attendance-fine-register";

type PopulatedMember = {
  memberId: {
    _id: Types.ObjectId;
    memberCode: string;
    name: string;
  };
  opening: FinancialYearMemberOpening;
};

export type MemberYearEndBalances = {
  pendingContribution: number;
  pendingAbsentFine: number;
};

/**
 * Returns pending contribution and absent fine for a member using the same
 * calculations as the Financial Year End Report.
 */
export async function getMemberYearEndBalances(
  financialYearId: string,
  memberId: string,
): Promise<MemberYearEndBalances> {
  await connectMongo();

  const financialYear = await FinancialYear.findById(financialYearId)
    .populate<{
      members: PopulatedMember[];
    }>({
      path: "members.memberId",
      select: "memberCode name",
    })
    .lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  const member = financialYear.members.find((item) => item.memberId._id.toString() === memberId);

  if (!member) {
    throw new Error("Member not found in the financial year.");
  }

  const [meetings, fineRegister] = await Promise.all([
    Meeting.find({
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
      .lean(),

    buildAttendanceFineRegister(financialYearId),
  ]);

  const memberOpeningContribution = member.opening?.contribution ?? 0;
  const openingContribution = standardOpeningContribution(
    financialYear.members.map((item) => item.opening?.contribution ?? 0),
  );

  const passbook = buildMemberPassbook({
    memberId,
    memberCode: member.memberId.memberCode,
    memberName: member.memberId.name,
    financialYearId: financialYear._id.toString(),
    financialYearName: financialYear.name,
    startDate: financialYear.startDate,
    openingContribution: memberOpeningContribution,
    meetings,
  });

  const contributionExpected = expectedContributionAmount(
    openingContribution,
    meetings.length,
    WEEKLY_CONTRIBUTION,
  );

  const pendingContribution = contributionToBePaid(contributionExpected, passbook.currentBalance);

  const fineRow = fineRegister.rows.find((row) => row.memberId === memberId);

  return {
    pendingContribution,
    pendingAbsentFine: fineRow?.pendingFine ?? 0,
  };
}
