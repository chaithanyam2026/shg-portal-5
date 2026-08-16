import connectMongo from "@/lib/db/mongodb";

import { Types } from "mongoose";

import Meeting from "@/models/Meeting";

import { assertCanUpdateMeeting } from "./internal/assert-can-update-meeting";

import { UpdateAttendanceInput, UpdateAttendanceSchema } from "../validation";

export async function updateAttendance(meetingId: string, input: UpdateAttendanceInput) {
  await connectMongo();

  const data = UpdateAttendanceSchema.parse(input);

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  await assertCanUpdateMeeting(meeting);

  meeting.attendance = data.attendance.map((record) => ({
    memberId: new Types.ObjectId(record.memberId),

    status: record.status,

    remarks: record.remarks,
  }));

  await meeting.save();

  return {
    message: "Attendance updated successfully.",
  };
}
