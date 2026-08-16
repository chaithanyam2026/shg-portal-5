import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";
import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import {
  getCalendarDayRange,
  isCalendarDateWithinRange,
  toCalendarDate,
} from "@/lib/utils/date";

import type { MeetingDetails } from "../types";
import { CreateMeetingInput, CreateMeetingSchema } from "../validation";

export async function createMeeting(
  input: CreateMeetingInput,
  userId?: string | null,
): Promise<MeetingDetails> {
  await connectMongo();

  const data = CreateMeetingSchema.parse(input);

  const meetingDate = toCalendarDate(data.meetingDate);

  const financialYear = await FinancialYear.findOne({
    status: "IN_PROGRESS",
  });

  if (!financialYear) {
    throw new Error("No active financial year found.");
  }

  if (
    !isCalendarDateWithinRange(meetingDate, financialYear.startDate, financialYear.endDate)
  ) {
    throw new Error("Meeting date must be inside the active financial year.");
  }

  const { start, end } = getCalendarDayRange(meetingDate);

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

    meetingDate,

    place: data.place,

    agenda: data.agenda,

    remarks: data.remarks,

    createdBy: userObjectId,

    updatedBy: userObjectId,
  });

  return {
    id: meeting._id.toString(),

    financialYearId: meeting.financialYearId.toString(),

    financialYearStatus: financialYear.status,

    canEdit: true,

    canReopen: false,

    canDelete: true,

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
