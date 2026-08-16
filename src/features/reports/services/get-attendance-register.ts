import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";
import type { FinancialYearDocument, FinancialYearMemberOpening } from "@/models/FinancialYear";
import type { Types } from "mongoose";

import { buildAttendanceRegister } from "./internal";

import { normalizeAttendanceStatus } from "@/features/meetings/domain/attendance-status";
import type { AttendanceRegister } from "../domain";

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
 * Returns the attendance register
 * for a financial year.
 */
export async function getAttendanceRegister(financialYearId: string): Promise<AttendanceRegister> {
  await connectMongo();

  const financialYear = await FinancialYear.findById(financialYearId)
    .populate({
      path: "members.memberId",
      select: "memberCode name",
    })
    .lean<PopulatedFinancialYear>();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  const meetings = await Meeting.find({
    financialYearId,

    status: "CLOSED",
  })
    .sort({
      meetingDate: 1,
    })
    .lean();

  return buildAttendanceRegister({
    financialYearId: financialYear._id.toString(),

    financialYearName: financialYear.name,

    members: financialYear.members.map((member) => ({
      memberId: member.memberId._id.toString(),

      memberCode: member.memberId.memberCode,

      memberName: member.memberId.name,
    })),

    meetings: meetings.map((meeting) => ({
      meetingId: meeting._id.toString(),

      meetingDate: meeting.meetingDate,

      attendance: meeting.attendance.map((record) => ({
        memberId: record.memberId.toString(),

        status: normalizeAttendanceStatus(record.status),
      })),
    })),
  });
}
