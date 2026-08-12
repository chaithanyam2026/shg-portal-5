import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import type { ExpenseRecord, ExpenseSummary } from "../types";

function createSummary(
  meetingId: string,
  status: ExpenseSummary["status"],
  records: ExpenseRecord[],
): ExpenseSummary {
  const totalExpense = records.reduce((sum, record) => sum + record.amount, 0);

  return {
    meetingId,
    status,
    records,
    totalExpense,
  };
}

export async function getExpenses(meetingId: string): Promise<ExpenseSummary> {
  await connectMongo();

  const meeting = await Meeting.findById(meetingId).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const records: ExpenseRecord[] = (meeting.expenses ?? []).map((expense) => ({
    transactionDate: expense.transactionDate.toISOString(),

    category: expense.category,

    amount: expense.amount,

    remarks: expense.remarks,
  }));

  return createSummary(meetingId, meeting.status, records);
}
