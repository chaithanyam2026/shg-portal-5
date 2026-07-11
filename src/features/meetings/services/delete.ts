import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import { MEETING_STATUS } from "../domain/meeting-status";

export async function deleteMeeting(
  id: string,
): Promise<void> {
  await connectMongo();

  const meeting = await Meeting.findById(id);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  if (meeting.status !== MEETING_STATUS.DRAFT) {
    throw new Error(
      "Only draft meetings can be deleted.",
    );
  }

  await meeting.deleteOne();
}