import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import type { MeetingDetails } from "../types";

export async function getMeeting(
  id: string,
): Promise<MeetingDetails> {
  await connectMongo();

  const meeting = await Meeting.findById(id).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  return {
    id: meeting._id.toString(),

    financialYearId:
      meeting.financialYearId.toString(),

    meetingDate:
      meeting.meetingDate.toISOString(),

    place: meeting.place,

    agenda: meeting.agenda,

    remarks: meeting.remarks,

    status: meeting.status,

    startedAt:
      meeting.startedAt?.toISOString() ?? null,

    approvedAt:
      meeting.approvedAt?.toISOString() ?? null,

    closedAt:
      meeting.closedAt?.toISOString() ?? null,

    createdBy:
      meeting.createdBy?.toString() ?? null,

    updatedBy:
      meeting.updatedBy?.toString() ?? null,

    createdAt:
      meeting.createdAt.toISOString(),

    updatedAt:
      meeting.updatedAt.toISOString(),
  };
}