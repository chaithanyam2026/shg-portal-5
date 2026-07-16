import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import {
  MEETING_STATUS,
} from "@/features/meetings/domain";

export type AttendanceMeeting = {
  meetingId: string;

  meetingDate: Date;

  attendance: Map<
    string,
    "PRESENT" | "ABSENT" | "LEAVE"
  >;
};

/**
 * Loads all CLOSED meetings for a
 * financial year.
 */
export async function loadAttendanceMeetings(
  financialYearId: string,
): Promise<AttendanceMeeting[]> {
  await connectMongo();

  const meetings =
    await Meeting.find({
      financialYearId,

      status:
        MEETING_STATUS.CLOSED,
    })
      .sort({
        meetingDate: 1,
      })
      .lean();

  return meetings.map(
    (meeting) => ({
      meetingId:
        meeting._id.toString(),

      meetingDate:
        meeting.meetingDate,

      attendance: new Map(
        meeting.attendance.map(
          (record: {
            memberId: unknown;
            status:
              | "PRESENT"
              | "ABSENT"
              | "LEAVE";
          }) => [
            record.memberId.toString(),
            record.status,
          ],
        ),
      ),
    }),
  );
}