import connectMongo from "@/lib/db/mongodb";
import Meeting from "@/models/Meeting";

import type { MeetingIncomeExpenseSummary } from "../domain/meeting-income-expense-summary";

function sumPositiveAmounts(items: { amount: number }[]): number {
  return items.reduce((total, item) => total + (item.amount > 0 ? item.amount : 0), 0);
}

export async function buildMeetingIncomeExpenseSummary(
  financialYearId: string,
): Promise<MeetingIncomeExpenseSummary> {
  await connectMongo();

  const meetings = await Meeting.find({
    financialYearId,
    status: "CLOSED",
  })
    .select({
      meetingDate: 1,
      otherIncomes: 1,
      expenses: 1,
    })
    .sort({
      meetingDate: 1,
    })
    .lean();

  const rows = meetings.flatMap((meeting) => {
    const income = sumPositiveAmounts(meeting.otherIncomes);
    const expense = sumPositiveAmounts(meeting.expenses);

    if (income <= 0 && expense <= 0) {
      return [];
    }

    return [
      {
        meetingId: meeting._id.toString(),
        meetingDate: meeting.meetingDate.toISOString(),
        income,
        expense,
      },
    ];
  });

  return {
    rows,
    totals: {
      income: rows.reduce((total, row) => total + row.income, 0),
      expense: rows.reduce((total, row) => total + row.expense, 0),
    },
  };
}
