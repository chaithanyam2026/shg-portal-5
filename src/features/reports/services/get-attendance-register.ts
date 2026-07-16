import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";

import {
  buildAttendanceRegister,
} from "./internal";

import type {
  AttendanceRegister,
} from "../domain";

/**
 * Returns the attendance register
 * for a financial year.
 */
export async function getAttendanceRegister(
  financialYearId: string,
): Promise<AttendanceRegister> {
  await connectMongo();

  const financialYear =
    await FinancialYear.findById(
      financialYearId,
    )
      .populate({
        path: "members.memberId",
        select:
          "memberCode name",
      })
      .lean();

  if (!financialYear) {
    throw new Error(
      "Financial year not found.",
    );
  }

  const meetings =
    await Meeting.find({
      financialYearId,

      status: "CLOSED",
    })
      .sort({
        meetingDate: 1,
      })
      .lean();

  return buildAttendanceRegister({
    financialYearId:
      financialYear._id.toString(),

    financialYearName:
      financialYear.name,

    members:
      financialYear.members.map(
        (member) => ({
          memberId:
            member.memberId._id.toString(),

          memberCode:
            member.memberId.memberCode,

          memberName:
            member.memberId.name,
        }),
      ),

    meetings: meetings.map(
      (meeting) => ({
        meetingId:
          meeting._id.toString(),

        meetingDate:
          meeting.meetingDate,

        attendance:
          meeting.attendance.map(
            (record) => ({
              memberId:
                record.memberId.toString(),

              status:
                record.status,
            }),
          ),
      }),
    ),
  });
}