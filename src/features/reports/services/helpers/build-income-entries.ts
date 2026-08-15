import { INCOME_CATEGORY_OPTIONS } from "@/features/meetings/domain/income";
import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";
import { compareCalendarDates, toCalendarDate } from "@/lib/utils/date";

type MeetingOtherIncomes = {
  _id: string;
  otherIncomes: {
    transactionDate: Date;
    category: string;
    amount: number;
    remarks: string;
  }[];
};

function getIncomeCategoryLabel(category: string): string {
  return INCOME_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}

export function buildIncomeEntries(meeting: MeetingOtherIncomes): LedgerEntry[] {
  const grouped = new Map<string, LedgerEntry>();

  for (const income of meeting.otherIncomes) {
    if (income.amount <= 0) {
      continue;
    }

    const date = toCalendarDate(income.transactionDate);
    const dateKey = date.toISOString().slice(0, 10);
    const key = `${dateKey}|${income.category}`;
    const label = getIncomeCategoryLabel(income.category);
    const existing = grouped.get(key);

    if (existing) {
      existing.income += income.amount;
      continue;
    }

    grouped.set(key, {
      date,
      transactionType: LEDGER_TRANSACTION_TYPE.OTHER_INCOME,
      description: label,
      income: income.amount,
      expense: 0,
      cashInHand: 0,
      bankBalance: 0,
      meetingId: meeting._id,
    });
  }

  return [...grouped.values()].sort((left, right) => compareCalendarDates(left.date, right.date));
}
