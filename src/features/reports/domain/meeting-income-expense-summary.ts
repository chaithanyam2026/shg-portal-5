export type MeetingIncomeExpenseRow = {
  meetingId: string;

  meetingDate: string;

  income: number;

  expense: number;
};

export type MeetingIncomeExpenseSummary = {
  rows: MeetingIncomeExpenseRow[];

  totals: {
    income: number;

    expense: number;
  };
};
