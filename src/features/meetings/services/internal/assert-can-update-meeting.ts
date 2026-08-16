import { auth } from "@/auth";
import { isAdminRole } from "@/lib/auth/roles";

import { MEETING_STATUS } from "../../domain/meeting-status";

export async function assertCanUpdateMeeting(meeting: { status: string }): Promise<void> {
  const session = await auth();

  if (isAdminRole(session?.user?.role)) {
    return;
  }

  if (meeting.status === MEETING_STATUS.CLOSED) {
    throw new Error("Closed meetings cannot be edited.");
  }
}
