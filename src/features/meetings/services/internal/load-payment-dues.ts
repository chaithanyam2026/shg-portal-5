import type { Types } from "mongoose";

import { processAttendance } from "@/features/reports/domain";
import FinancialYear from "@/models/FinancialYear";
import Meeting from "@/models/Meeting";
import type { FinancialYearDocument, FinancialYearMemberOpening } from "@/models/FinancialYear";

import { ATTENDANCE_STATUS, normalizeAttendanceStatus } from "../../domain/attendance-status";
import { MEETING_STATUS } from "../../domain/meeting-status";
import { WEEKLY_CONTRIBUTION } from "../../domain/payment";

type FinancialYearWithOpenings = Omit<FinancialYearDocument, "members"> & {
  members: {
    memberId: Types.ObjectId;
    opening: FinancialYearMemberOpening;
  }[];
};

export type MemberPaymentDues = {
  contributionDue: number;
  absentFineDue: number;
};

function isPriorToCurrent(meetingDate: Date, meetingId: string, currentDate: Date, currentId: string) {
  const dateDiff = meetingDate.getTime() - currentDate.getTime();

  if (dateDiff < 0) {
    return true;
  }

  if (dateDiff > 0) {
    return false;
  }

  return meetingId < currentId;
}

/**
 * Contribution and absent-fine still owed as of this meeting,
 * excluding amounts entered on this meeting's payment row.
 */
export async function loadPaymentDues(
  financialYearId: string,
  meetingId: string,
  meetingDate: Date,
): Promise<Map<string, MemberPaymentDues>> {
  const [financialYear, meetings] = await Promise.all([
    FinancialYear.findById(financialYearId).lean<FinancialYearWithOpenings>(),
    Meeting.find({ financialYearId })
      .select({
        meetingDate: 1,
        status: 1,
        attendance: 1,
        payments: 1,
      })
      .sort({
        meetingDate: 1,
      })
      .lean(),
  ]);

  const dues = new Map<string, MemberPaymentDues>();

  if (!financialYear) {
    return dues;
  }

  const priorClosed = meetings.filter(
    (meeting) =>
      meeting.status === MEETING_STATUS.CLOSED &&
      isPriorToCurrent(meeting.meetingDate, meeting._id.toString(), meetingDate, meetingId),
  );

  const currentMeeting = meetings.find((meeting) => meeting._id.toString() === meetingId);
  const currentHasAttendance = (currentMeeting?.attendance?.length ?? 0) > 0;

  const expectedWeeks = priorClosed.length + 1;

  for (const member of financialYear.members) {
    const memberId = member.memberId.toString();
    const openingContribution = member.opening?.contribution ?? 0;

    let paidContribution = openingContribution;
    let paidAbsentFine = 0;
    let consecutiveAbsence = 0;
    let chargedAbsentFine = 0;

    for (const meeting of priorClosed) {
      const payment = meeting.payments?.find((item) => item.memberId.toString() === memberId);

      paidContribution += payment?.contribution ?? 0;
      paidAbsentFine += payment?.absentFine ?? 0;

      const attendance = meeting.attendance?.find((item) => item.memberId.toString() === memberId);
      const status = normalizeAttendanceStatus(attendance?.status);
      const result = processAttendance(consecutiveAbsence, status);

      consecutiveAbsence = result.consecutiveAbsence;
      chargedAbsentFine += result.fineCharged;
    }

    if (currentHasAttendance) {
      const attendance = currentMeeting?.attendance?.find(
        (item) => item.memberId.toString() === memberId,
      );
      const status = attendance
        ? normalizeAttendanceStatus(attendance.status)
        : ATTENDANCE_STATUS.PRESENT;
      const result = processAttendance(consecutiveAbsence, status);

      chargedAbsentFine += result.fineCharged;
    }

    const expectedContribution = openingContribution + expectedWeeks * WEEKLY_CONTRIBUTION;

    dues.set(memberId, {
      contributionDue: expectedContribution - paidContribution,
      absentFineDue: chargedAbsentFine - paidAbsentFine,
    });
  }

  return dues;
}
