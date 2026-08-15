import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import { toIsoString } from "@/lib/utils/date";

import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";
import Meeting from "@/models/Meeting";
import Member from "@/models/Member";

import type { MeetingLoansSummary } from "../types";

export async function getMeetingLoans(meetingId: string): Promise<MeetingLoansSummary> {
  await connectMongo();

  const meeting = await Meeting.findById(meetingId).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const financialYear = await FinancialYear.findById(meeting.financialYearId)
    .select({
      members: 1,
    })
    .lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  const memberIds = financialYear.members.map((entry) => entry.memberId);

  const [members, loans] = await Promise.all([
    Member.find({
      _id: {
        $in: memberIds,
      },
    })
      .select({
        memberCode: 1,
        name: 1,
      })
      .sort({
        memberCode: 1,
      })
      .lean(),

    Loan.find({
      meetingId: meeting._id,
    })
      .populate<{
        memberId: {
          memberCode: string;
          name: string;
        };
      }>({
        path: "memberId",
        select: "memberCode name",
      })
      .sort({
        loanNumber: 1,
      })
      .lean(),
  ]);

  return {
    meetingId: meeting._id.toString(),
    financialYearId: meeting.financialYearId.toString(),
    meetingDate: meeting.meetingDate.toISOString(),
    status: meeting.status,
    members: members.map((member) => ({
      _id: member._id.toString(),
      memberCode: member.memberCode,
      name: member.name,
    })),
    loans: loans.map((loan) => ({
      _id: loan._id.toString(),
      loanNumber: loan.loanNumber,
      memberCode: loan.memberId.memberCode,
      memberName: loan.memberId.name,
      loanType: loan.loanType,
      sanctionedAmount: loan.sanctionedAmount,
      disbursedAmount: loan.disbursedAmount,
      sanctionedDate:
        toIsoString(loan.sanctionedDate) ?? toIsoString(loan.disbursedDate) ?? "",
      disbursedDate: toIsoString(loan.disbursedDate) ?? "",
      expiryDate: toIsoString(loan.expiryDate),
    })),
  };
}
