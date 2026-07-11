import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";

import { MEETING_STATUS } from "../domain/meeting-status";
import {
  UpdateMeetingInput,
  UpdateMeetingSchema,
} from "../validation";

export async function updateMeeting(
  id: string,
  input: UpdateMeetingInput,
  userId?: string | null,
) {
  await connectMongo();

  const data = UpdateMeetingSchema.parse(input);

  const meeting = await Meeting.findById(id);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  if (meeting.status === MEETING_STATUS.CLOSED) {
    throw new Error(
      "Closed meetings cannot be edited.",
    );
  }

  const financialYear =
    await FinancialYear.findById(
      meeting.financialYearId,
    );

  if (!financialYear) {
    throw new Error(
      "Financial year not found.",
    );
  }

  if (data.meetingDate) {
    data.meetingDate.setHours(0, 0, 0, 0);

    if (
      data.meetingDate < financialYear.startDate ||
      data.meetingDate > financialYear.endDate
    ) {
      throw new Error(
        "Meeting date must be inside the financial year.",
      );
    }

    const start = new Date(data.meetingDate);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const exists = await Meeting.exists({
      _id: {
        $ne: meeting._id,
      },

      financialYearId: meeting.financialYearId,

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

    meeting.meetingDate = data.meetingDate;
  }

  if (data.place !== undefined) {
    meeting.place = data.place;
  }

  if (data.agenda !== undefined) {
    meeting.agenda = data.agenda;
  }

  if (data.remarks !== undefined) {
    meeting.remarks = data.remarks;
  }

  if (userId) {
    meeting.updatedBy = userId;
  }

  await meeting.save();

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
      meeting.startedAt?.toISOString() ??
      null,

    approvedAt:
      meeting.approvedAt?.toISOString() ??
      null,

    closedAt:
      meeting.closedAt?.toISOString() ??
      null,

    createdBy:
      meeting.createdBy?.toString() ??
      null,

    updatedBy:
      meeting.updatedBy?.toString() ??
      null,

    createdAt:
      meeting.createdAt.toISOString(),

    updatedAt:
      meeting.updatedAt.toISOString(),
  };
}