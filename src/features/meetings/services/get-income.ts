import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";

import type { IncomeRecord, IncomeSummary } from "../types";

function createSummary(
  meetingId: string,
  status: IncomeSummary["status"],
  records: IncomeRecord[],
): IncomeSummary {
  const totalIncome = records.reduce((sum, record) => sum + record.amount, 0);

  return {
    meetingId,
    status,
    records,
    totalIncome,
  };
}

export async function getIncome(meetingId: string): Promise<IncomeSummary> {
  await connectMongo();

  const meeting = await Meeting.findById(meetingId).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const records: IncomeRecord[] = (meeting.otherIncomes ?? []).map((income) => ({
    transactionDate: income.transactionDate.toISOString(),

    category: income.category,

    amount: income.amount,

    remarks: income.remarks,
  }));

  return createSummary(meetingId, meeting.status, records);
}
