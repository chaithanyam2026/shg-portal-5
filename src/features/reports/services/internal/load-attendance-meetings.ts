import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";
import type { Types } from "mongoose";

import { MEETING_STATUS } from "@/features/meetings/domain";
import type { AttendanceStatus } from "@/features/reports/domain";

export type AttendanceMeeting = {
  meetingId: string;

  meetingDate: Date;

  attendance: Map<string, AttendanceStatus>;
};

function toReportAttendanceStatus(status: string): AttendanceStatus {
  return status === "EXCUSED" ? "LEAVE" : (status as AttendanceStatus);
}

/**
 * Loads all CLOSED meetings for a
 * financial year.
 */
export async function loadAttendanceMeetings(
  financialYearId: string,
): Promise<AttendanceMeeting[]> {
  await connectMongo();

  const meetings = await Meeting.find({
    financialYearId,

    status: MEETING_STATUS.CLOSED,
  })
    .sort({
      meetingDate: 1,
    })
    .lean();

  return meetings.map((meeting) => ({
    meetingId: meeting._id.toString(),

    meetingDate: meeting.meetingDate,

    attendance: new Map(
      meeting.attendance.map(
        (record: { memberId: Types.ObjectId; status: string }) => [
          record.memberId.toString(),
          toReportAttendanceStatus(record.status),
        ],
      ),
    ),
  }));
}
