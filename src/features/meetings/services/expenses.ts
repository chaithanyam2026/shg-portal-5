import connectMongo from "@/lib/db/mongodb";
import { toCalendarDate } from "@/lib/utils/date";

import Meeting from "@/models/Meeting";

import { assertCanUpdateMeeting } from "./internal/assert-can-update-meeting";

import { UpdateExpensesInput, UpdateExpensesSchema } from "../validation";

export async function updateExpenses(meetingId: string, input: UpdateExpensesInput) {
  await connectMongo();

  const data = UpdateExpensesSchema.parse(input);

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  await assertCanUpdateMeeting(meeting);

  meeting.expenses = data.expenses.map((expense) => ({
    transactionDate: toCalendarDate(expense.transactionDate),

    category: expense.category,

    amount: expense.amount,

    remarks: expense.remarks,
  }));

  await meeting.save();

  const { revalidateMeetings } = await import("@/lib/cache");
  revalidateMeetings();

  return {
    message: "Expenses updated successfully.",
  };
}
