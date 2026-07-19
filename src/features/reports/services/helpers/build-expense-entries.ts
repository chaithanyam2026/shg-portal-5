import type { LedgerEntry } from "@/features/reports/domain/ledger-entry";
import { LEDGER_TRANSACTION_TYPE } from "@/features/reports/domain/transaction-type";

type MeetingExpenses = {
  _id: string;
  expenses: {
    transactionDate: Date;
    category: string;
    amount: number;
    remarks: string;
  }[];
};

export function buildExpenseEntries(meeting: MeetingExpenses): LedgerEntry[] {
  return meeting.expenses.flatMap((expense) => {
    if (expense.amount <= 0) {
      return [];
    }

    return [
      {
        date: expense.transactionDate,
        transactionType: LEDGER_TRANSACTION_TYPE.OTHER_EXPENSE,
        description: expense.category,
        income: 0,
        expense: expense.amount,
        cashInHand: 0,
        bankBalance: 0,
        meetingId: meeting._id,
      },
    ];
  });
}
