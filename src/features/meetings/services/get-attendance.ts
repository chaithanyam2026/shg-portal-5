import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";
import Member from "@/models/Member";

import type {
  AttendanceSummary,
} from "../types";

export async function getAttendance(
  meetingId: string,
): Promise<AttendanceSummary> {
  await connectMongo();

  const meeting = await Meeting.findById(
    meetingId,
  ).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const attendance =
  meeting.attendance ?? [];
  if (
   attendance.length === 0
  ) {
    const members =
      await Member.find({
        active: true,
      })
        .sort({
          memberCode: 1,
        })
        .lean();

    return {
      meetingId,
status: meeting.status,
      records: members.map(
        (member) => ({
          memberId:
            member._id.toString(),

          memberCode:
            member.memberCode,

          memberName:
            member.name,

          status: "PRESENT",

          remarks: "",
        }),
      ),
    };
  }

  const members =
    await Member.find({
      _id: {
        $in: meeting.attendance.map(
          (record) =>
            record.memberId,
        ),
      },
    }).lean();

  const memberMap = new Map(
    members.map((member) => [
      member._id.toString(),
      member,
    ]),
  );

  return {
    meetingId,
status: meeting.status,
    records: meeting.attendance.map(
      (record) => {
        const member =
          memberMap.get(
            record.memberId.toString(),
          );

        return {
          memberId:
            record.memberId.toString(),

          memberCode:
            member?.memberCode ?? "",

          memberName:
            member?.name ?? "",

          status:
            record.status,

          remarks:
            record.remarks,
        };
      },
    ),
  };
}