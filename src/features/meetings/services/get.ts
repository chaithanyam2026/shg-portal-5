import connectMongo from "@/lib/db/mongodb";

import type { FinancialYearStatus } from "@/features/financial-year/domain/financial-year-status";
import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";

import type { MeetingDetails } from "../types";

export async function getMeeting(id: string): Promise<MeetingDetails> {
  await connectMongo();

  const meeting = await Meeting.findById(id).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const financialYear = await FinancialYear.findById(meeting.financialYearId).select("status").lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  return {
    id: meeting._id.toString(),

    financialYearId: meeting.financialYearId.toString(),

    financialYearStatus: financialYear.status as FinancialYearStatus,

    meetingDate: meeting.meetingDate.toISOString(),

    place: meeting.place,

    agenda: meeting.agenda,

    remarks: meeting.remarks,

    status: meeting.status,

    startedAt: meeting.startedAt?.toISOString() ?? null,

    approvedAt: meeting.approvedAt?.toISOString() ?? null,

    closedAt: meeting.closedAt?.toISOString() ?? null,

    createdBy: meeting.createdBy?.toString() ?? null,

    updatedBy: meeting.updatedBy?.toString() ?? null,

    createdAt: meeting.createdAt.toISOString(),

    updatedAt: meeting.updatedAt.toISOString(),
  };
}
