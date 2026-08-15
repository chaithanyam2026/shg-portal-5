import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import { createLoan } from "@/features/loans/services/create";
import type { LoanDetails } from "@/features/loans/types";
import { CreateMeetingLoanInput, CreateMeetingLoanSchema } from "@/features/loans/validation";

import { MEETING_STATUS } from "../domain/meeting-status";

export async function createMeetingLoan(
  meetingId: string,
  input: CreateMeetingLoanInput,
): Promise<LoanDetails> {
  await connectMongo();

  const data = CreateMeetingLoanSchema.parse(input);

  const meeting = await Meeting.findById(meetingId).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  if (meeting.status === MEETING_STATUS.CLOSED) {
    throw new Error("Loans cannot be created after the meeting is closed.");
  }

  return createLoan({
    ...data,
    financialYearId: meeting.financialYearId.toString(),
    meetingId,
  });
}
