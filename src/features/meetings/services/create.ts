import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";
import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";

import type { MeetingDetails } from "../types";
import { CreateMeetingInput, CreateMeetingSchema } from "../validation";

export async function createMeeting(
  input: CreateMeetingInput,
  userId?: string | null,
): Promise<MeetingDetails> {
  await connectMongo();

  const data = CreateMeetingSchema.parse(input);

  data.meetingDate.setHours(0, 0, 0, 0);

  const financialYear = await FinancialYear.findOne({
    status: "IN_PROGRESS",
  });

  if (!financialYear) {
    throw new Error("No active financial year found.");
  }

  if (data.meetingDate < financialYear.startDate || data.meetingDate > financialYear.endDate) {
    throw new Error("Meeting date must be inside the active financial year.");
  }

  const start = new Date(data.meetingDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const exists = await Meeting.exists({
    financialYearId: financialYear._id,
    meetingDate: {
      $gte: start,
      $lt: end,
    },
  });

  if (exists) {
    throw new Error("A meeting already exists for this date.");
  }

  const userObjectId = userId ? new Types.ObjectId(userId) : null;

  const meeting = await Meeting.create({
    financialYearId: financialYear._id,

    meetingDate: data.meetingDate,

    place: data.place,

    agenda: data.agenda,

    remarks: data.remarks,

    createdBy: userObjectId,

    updatedBy: userObjectId,
  });

  return {
    id: meeting._id.toString(),

    financialYearId: meeting.financialYearId.toString(),

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
