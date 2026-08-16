import { auth } from "@/auth";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";

import Meeting from "@/models/Meeting";

import { isDeletable } from "../domain/meeting-rules";

export async function deleteMeeting(id: string): Promise<void> {
  await connectMongo();

  const meeting = await Meeting.findById(id);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const session = await auth();

  if (!isDeletable(meeting.status, session?.user?.role)) {
    throw new AppError(
      "Only draft meetings can be deleted, unless you are an administrator deleting a closed meeting.",
      403,
    );
  }

  await meeting.deleteOne();

  const { revalidateMeetings } = await import("@/lib/cache");
  revalidateMeetings();
}
