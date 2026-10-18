import connectMongo from "@/lib/db/mongodb";
import { Types } from "mongoose";

import Meeting from "@/models/Meeting";

import { MEETING_STATUS } from "../domain/meeting-status";

import type { MeetingDetails } from "../types";
import { getMeeting } from "./get";
import { assertMeetingReadyToClose } from "./internal/assert-meeting-ready-to-close";

export async function closeMeeting(id: string, userId?: string | null): Promise<MeetingDetails> {
  await connectMongo();

  const meeting = await Meeting.findById(id);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  if (meeting.status !== MEETING_STATUS.IN_PROGRESS) {
    throw new Error("Only meetings in progress can be closed.");
  }

  await assertMeetingReadyToClose(meeting);

  meeting.status = MEETING_STATUS.CLOSED;
  meeting.closedAt = new Date();

  if (userId) {
    meeting.updatedBy = new Types.ObjectId(userId);
  }

  await meeting.save();

  const { revalidateMeetings } = await import("@/lib/cache");
  revalidateMeetings();

  return getMeeting(id);
}
