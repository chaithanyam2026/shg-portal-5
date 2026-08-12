import connectMongo from "@/lib/db/mongodb";

import { WEEKLY_CONTRIBUTION } from "@/features/meetings/domain/payment";
import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";
import type { FinancialYearDocument, FinancialYearMemberOpening } from "@/models/FinancialYear";
import type { Types } from "mongoose";

import type { MemberContributionPayments } from "../domain/member-contribution-payments";

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
 * Returns contribution payment tracking
 * for a member in a financial year.
 */
export async function getMemberContributionPayments(
  memberId: string,
  financialYearId: string,
): Promise<MemberContributionPayments> {
  await connectMongo();

  const financialYear = await FinancialYear.findOne({
    _id: financialYearId,
    "members.memberId": memberId,
  })
    .populate({
      path: "members.memberId",
      select: "memberCode name",
    })
    .lean<PopulatedFinancialYear>();

  if (!financialYear) {
    throw new Error("Member not found in the financial year.");
  }

  const member = financialYear.members.find(
    (item) => item.memberId._id.toString() === memberId,
  );

  if (!member) {
    throw new Error("Member not found in the financial year.");
  }

  const openingContribution = member.opening?.contribution ?? 0;

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

  const passbook = buildMemberPassbook({
    memberId,
    memberCode: member.memberId.memberCode,
    memberName: member.memberId.name,
    financialYearId: financialYear._id.toString(),
    financialYearName: financialYear.name,
    startDate: financialYear.startDate,
    openingContribution,
    meetings,
  });

  const closedMeetingCount = meetings.length;

  const totalExpected = openingContribution + closedMeetingCount * WEEKLY_CONTRIBUTION;

  const totalPaid = passbook.currentBalance;

  const totalPending = Math.max(0, totalExpected - totalPaid);

  const entries: MemberContributionPayments["entries"] = [];

  if (openingContribution > 0) {
    entries.push({
      meetingDate: financialYear.startDate,
      description: "Opening Contribution",
      expectedAmount: openingContribution,
      paidAmount: openingContribution,
      pendingAmount: 0,
    });
  }

  for (const meeting of meetings) {
    const payment = meeting.payments.find((item) => item.memberId.toString() === memberId);

    const paidAmount = payment?.contribution ?? 0;

    const pendingAmount = Math.max(0, WEEKLY_CONTRIBUTION - paidAmount);

    entries.push({
      meetingId: meeting._id.toString(),
      meetingDate: meeting.meetingDate,
      description: "Weekly Contribution",
      expectedAmount: WEEKLY_CONTRIBUTION,
      paidAmount,
      pendingAmount,
    });
  }

  return {
    memberId,
    memberCode: member.memberId.memberCode,
    memberName: member.memberId.name,
    financialYearId: financialYear._id.toString(),
    financialYearName: financialYear.name,
    openingContribution,
    closedMeetingCount,
    weeklyContributionAmount: WEEKLY_CONTRIBUTION,
    totalExpected,
    totalPaid,
    totalPending,
    entries,
  };
}
