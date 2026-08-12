import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import { MEETING_STATUS } from "../domain/meeting-status";

import { UpdateIncomeInput, UpdateIncomeSchema } from "../validation";

export async function updateIncome(meetingId: string, input: UpdateIncomeInput) {
  await connectMongo();

  const data = UpdateIncomeSchema.parse(input);

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  if (meeting.status === MEETING_STATUS.CLOSED) {
    throw new Error("Income cannot be updated after the meeting is closed.");
  }

  meeting.otherIncomes = data.otherIncomes.map((income) => ({
    transactionDate: income.transactionDate,

    category: income.category,

    amount: income.amount,

    remarks: income.remarks,
  }));

  await meeting.save();

  return {
    message: "Income updated successfully.",
  };
}
