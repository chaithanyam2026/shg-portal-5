import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import { MEETING_STATUS } from "../domain/meeting-status";

import { UpdateExpensesInput, UpdateExpensesSchema } from "../validation";

export async function updateExpenses(meetingId: string, input: UpdateExpensesInput) {
  await connectMongo();

  const data = UpdateExpensesSchema.parse(input);

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  if (meeting.status === MEETING_STATUS.CLOSED) {
    throw new Error("Expenses cannot be updated after the meeting is closed.");
  }

  meeting.expenses = data.expenses.map((expense) => ({
    transactionDate: expense.transactionDate,

    category: expense.category,

    amount: expense.amount,

    remarks: expense.remarks,
  }));

  await meeting.save();

  return {
    message: "Expenses updated successfully.",
  };
}
