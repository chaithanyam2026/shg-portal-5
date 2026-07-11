import Meeting from "@/models/Meeting";
import FinancialYear from "@/models/FinancialYear";

import connectMongo from "@/lib/db/mongodb";

import {
  CreateMeetingInput,
  CreateMeetingSchema,
} from "../validation";

export async function createMeeting(
  input: CreateMeetingInput,
  userId?: string | null,
) {
  await connectMongo();

  const data = CreateMeetingSchema.parse(input);

  data.meetingDate.setHours(0, 0, 0, 0);

  const financialYear =
    await FinancialYear.findOne({
      status: "IN_PROGRESS",
    });

  if (!financialYear) {
    throw new Error(
      "No active financial year found.",
    );
  }

  if (
    data.meetingDate < financialYear.startDate ||
    data.meetingDate > financialYear.endDate
  ) {
    throw new Error(
      "Meeting date must be inside the active financial year.",
    );
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
    throw new Error(
      "A meeting already exists for this date.",
    );
  }

  const meeting = await Meeting.create({
    financialYearId: financialYear._id,

    meetingDate: data.meetingDate,

    place: data.place,

    agenda: data.agenda,

    remarks: data.remarks,

    createdBy: userId,

    updatedBy: userId,
  });

  return meeting;
}