import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import {
  MEETING_STATUS,
} from "../domain/meeting-status";

import {
  UpdateAttendanceInput,
  UpdateAttendanceSchema,
} from "../validation";

export async function updateAttendance(
  meetingId: string,
  input: UpdateAttendanceInput,
) {
  await connectMongo();

  const data =
    UpdateAttendanceSchema.parse(
      input,
    );

  const meeting =
    await Meeting.findById(
      meetingId,
    );

  if (!meeting) {
    throw new Error(
      "Meeting not found.",
    );
  }

  if (
    meeting.status ===
    MEETING_STATUS.CLOSED
  ) {
    throw new Error(
      "Attendance cannot be updated after the meeting is closed.",
    );
  }

  meeting.attendance =
    data.attendance.map(
      (record) => ({
        memberId: record.memberId,

        status: record.status,

        remarks:
          record.remarks,
      }),
    );

  await meeting.save();

  return {
    message:
      "Attendance updated successfully.",
  };
}