import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import type { AttendanceSummary } from "../types";
import { loadFinancialYearMembers } from "./internal/load-financial-year-members";
import type { MeetingDocument } from "@/models/Meeting";
import { normalizeAttendanceStatus } from "../domain/attendance-status";


export async function getAttendance(meetingId: string): Promise<AttendanceSummary> {
  await connectMongo();

  const meeting = await Meeting.findById(meetingId)
    .lean<MeetingDocument>();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const attendance = meeting.attendance ?? [];
  if (attendance.length === 0) {
    /*  const members =
      await Member.find({
        active: true,
      })
        .sort({
          memberCode: 1,
        })
        .lean(); */
    const members = await loadFinancialYearMembers(meeting.financialYearId.toString());

    return {
      meetingId,
      status: meeting.status,
      saved: false,
      records: members.map((member) => ({
        memberId: member._id.toString(),

        memberCode: member.memberCode,

        memberName: member.name,

        status: "PRESENT",

        remarks: "",
      })),
    };
  }

  const members = await loadFinancialYearMembers(meeting.financialYearId.toString());

  const memberMap = new Map(members.map((member) => [member._id.toString(), member]));

  return {
    meetingId,
    status: meeting.status,
    saved: true,
    records: meeting.attendance.map((record) => {
      const member = memberMap.get(record.memberId.toString());

      return {
        memberId: record.memberId.toString(),

        memberCode: member?.memberCode ?? "",

        memberName: member?.name ?? "",

        status: normalizeAttendanceStatus(record.status),

        remarks: record.remarks,
      };
    }),
  };
}
