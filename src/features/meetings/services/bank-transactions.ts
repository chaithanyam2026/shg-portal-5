import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import {
  MEETING_STATUS,
} from "../domain/meeting-status";

import {
  UpdateBankTransactionsInput,
  UpdateBankTransactionsSchema,
} from "../validation";

export async function updateBankTransactions(
  meetingId: string,
  input: UpdateBankTransactionsInput,
) {
  await connectMongo();

  const data =
    UpdateBankTransactionsSchema.parse(
      input,
    );

  const meeting =
    await Meeting.findById(
      meetingId,
    );

  if (!meeting) {
    throw new Error(
      "Meeting not found.",
    );
  }

  if (
    meeting.status ===
    MEETING_STATUS.CLOSED
  ) {
    throw new Error(
      "Bank transactions cannot be updated after the meeting is closed.",
    );
  }

 /*  meeting.bankTransactions =
    data.bankTransactions.map(
      (transaction) => ({
        transactionDate:
          transaction.transactionDate,

        type: transaction.type,

        amount:
          transaction.amount,

        remarks:
          transaction.remarks,
      }),
    ); */
    

  await meeting.save();

  const saved = await Meeting.findById(meetingId).lean();

  return createResponse(
    "Bank transactions updated successfully.",
  );
}

function createResponse(
  message: string,
) {
  return {
    message,
  };
}