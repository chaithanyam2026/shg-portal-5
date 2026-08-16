import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";
import { Types } from "mongoose";

import { assertCanUpdateMeeting } from "./internal/assert-can-update-meeting";

import { UpdatePaymentsInput, UpdatePaymentsSchema } from "../validation";

export async function updatePayments(meetingId: string, input: UpdatePaymentsInput) {
  await connectMongo();

  const data = UpdatePaymentsSchema.parse(input);

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  await assertCanUpdateMeeting(meeting);

  meeting.payments = data.payments.map((payment) => ({
    memberId: new Types.ObjectId(payment.memberId),

    contribution: payment.contribution,

    loanRepayment: payment.loanRepayment,

    absentFine: payment.absentFine,

    specialLoanFine: payment.specialLoanFine,

    remarks: payment.remarks,
  }));

  await meeting.save();

  const { revalidateMeetingWrites } = await import("@/lib/cache");
  revalidateMeetingWrites();

  return {
    message: "Payments updated successfully.",
  };
}
