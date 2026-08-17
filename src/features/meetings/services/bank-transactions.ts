import connectMongo from "@/lib/db/mongodb";
import { toCalendarDate } from "@/lib/utils/date";

import Meeting from "@/models/Meeting";

import { assertCanUpdateMeeting } from "./internal/assert-can-update-meeting";

import { UpdateBankTransactionsInput, UpdateBankTransactionsSchema } from "../validation";

export async function updateBankTransactions(
  meetingId: string,
  input: UpdateBankTransactionsInput,
) {
  await connectMongo();

  const data = UpdateBankTransactionsSchema.parse(input);

  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  await assertCanUpdateMeeting(meeting);

  meeting.bankTransactions = data.bankTransactions.map((transaction) => ({
    transactionDate: toCalendarDate(transaction.transactionDate),
    type: transaction.type,
    amount: transaction.amount,
    remarks: transaction.remarks ?? "",
  }));

  await meeting.save();

  const { revalidateMeetings } = await import("@/lib/cache");
  revalidateMeetings();

  await Meeting.findById(meetingId).lean();

  return createResponse("Bank transactions updated successfully.");
}

function createResponse(message: string) {
  return {
    message,
  };
}
