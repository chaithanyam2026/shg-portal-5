import connectMongo from "@/lib/db/mongodb";
import { auth } from "@/auth";

import type { FinancialYearStatus } from "@/features/financial-year/domain/financial-year-status";
import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";

import { canReopenMeeting, isDeletable, isEditable } from "../domain/meeting-rules";
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

  const session = await auth();

  return {
    id: meeting._id.toString(),

    financialYearId: meeting.financialYearId.toString(),

    financialYearStatus: financialYear.status as FinancialYearStatus,

    canEdit: isEditable(meeting.status, financialYear.status, session?.user?.role),

    canReopen: canReopenMeeting(meeting.status, session?.user?.role),

    canDelete: isDeletable(meeting.status, session?.user?.role),

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
