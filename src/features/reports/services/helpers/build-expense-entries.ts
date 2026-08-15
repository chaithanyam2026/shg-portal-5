import { EXPENSE_CATEGORY_OPTIONS } from "@/features/meetings/domain/expense";
import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";
import { compareCalendarDates, toCalendarDate } from "@/lib/utils/date";

type MeetingExpenses = {
  _id: string;
  expenses: {
    transactionDate: Date;
    category: string;
    amount: number;
    remarks: string;
  }[];
};

function getExpenseCategoryLabel(category: string): string {
  return EXPENSE_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}

export function buildExpenseEntries(meeting: MeetingExpenses): LedgerEntry[] {
  const grouped = new Map<string, LedgerEntry>();

  for (const expense of meeting.expenses) {
    if (expense.amount <= 0) {
      continue;
    }

    const date = toCalendarDate(expense.transactionDate);
    const dateKey = date.toISOString().slice(0, 10);
    const key = `${dateKey}|${expense.category}`;
    const label = getExpenseCategoryLabel(expense.category);
    const existing = grouped.get(key);

    if (existing) {
      existing.expense += expense.amount;
      continue;
    }

    grouped.set(key, {
      date,
      transactionType: LEDGER_TRANSACTION_TYPE.OTHER_EXPENSE,
      description: label,
      income: 0,
      expense: expense.amount,
      cashInHand: 0,
      bankBalance: 0,
      meetingId: meeting._id,
    });
  }

  return [...grouped.values()].sort((left, right) => compareCalendarDates(left.date, right.date));
}
