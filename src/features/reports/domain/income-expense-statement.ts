export type IncomeExpenseDetail = {
  date: Date;
  description: string;
  amount: number;
  meetingId?: string;
};

export type IncomeExpenseStatementItem = {
  key: string;
  label: string;
  amount: number;
  details: IncomeExpenseDetail[];
};

export type IncomeExpenseStatementSection = {
  items: IncomeExpenseStatementItem[];
  total: number;
};

export type IncomeExpenseStatement = {
  income: IncomeExpenseStatementSection;
  expense: IncomeExpenseStatementSection;
};
