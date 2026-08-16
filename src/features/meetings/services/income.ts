import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import { assertCanUpdateMeeting } from "./internal/assert-can-update-meeting";

import { UpdateIncomeInput, UpdateIncomeSchema } from "../validation";

export async function updateIncome(meetingId: string, input: UpdateIncomeInput) {
  await connectMongo();

  const data = UpdateIncomeSchema.parse(input);

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  await assertCanUpdateMeeting(meeting);

  meeting.otherIncomes = data.otherIncomes.map((income) => ({
    transactionDate: income.transactionDate,

    category: income.category,

    amount: income.amount,

    remarks: income.remarks,
  }));

  await meeting.save();

  const { revalidateMeetings } = await import("@/lib/cache");
  revalidateMeetings();

  return {
    message: "Income updated successfully.",
  };
}
