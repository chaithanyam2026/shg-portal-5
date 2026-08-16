import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/guards";

import Meeting from "@/models/Meeting";

import { MEETING_STATUS } from "../domain/meeting-status";
import type { MeetingDetails } from "../types";
import { getMeeting } from "./get";

export async function reopenMeeting(id: string): Promise<MeetingDetails> {
  await connectMongo();

  const session = await requireRole(ADMIN_ROLES);

  const meeting = await Meeting.findById(id);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  if (meeting.status !== MEETING_STATUS.CLOSED) {
    throw new AppError("Only closed meetings can be reopened.", 400);
  }

  meeting.status = MEETING_STATUS.IN_PROGRESS;
  meeting.closedAt = null;
  meeting.updatedBy = new Types.ObjectId(session.user.id);

  await meeting.save();

  const { revalidateMeetings } = await import("@/lib/cache");
  revalidateMeetings();

  return getMeeting(id);
}
