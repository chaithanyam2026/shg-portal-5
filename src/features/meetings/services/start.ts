import connectMongo from "@/lib/db/mongodb";

import type { FinancialYearStatus } from "@/features/financial-year/domain/financial-year-status";
import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";
import { Types } from "mongoose";

import { MEETING_STATUS } from "../domain/meeting-status";

import type { MeetingDetails } from "../types";

async function loadFinancialYearStatus(financialYearId: unknown): Promise<FinancialYearStatus> {
  const financialYear = await FinancialYear.findById(financialYearId).select("status").lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  return financialYear.status as FinancialYearStatus;
}

export async function startMeeting(id: string, userId?: string | null): Promise<MeetingDetails> {
  await connectMongo();

  const meeting = await Meeting.findById(id);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  if (meeting.status !== MEETING_STATUS.DRAFT) {
    throw new Error("Only draft meetings can be started.");
  }

  meeting.status = MEETING_STATUS.IN_PROGRESS;
  meeting.startedAt = new Date();

  if (userId) {
    meeting.updatedBy = new Types.ObjectId(userId);
  }

  await meeting.save();

  return {
    id: meeting._id.toString(),

    financialYearId: meeting.financialYearId.toString(),

    financialYearStatus: await loadFinancialYearStatus(meeting.financialYearId),

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
