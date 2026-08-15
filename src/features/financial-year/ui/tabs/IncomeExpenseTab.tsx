import { Alert } from "@mui/material";

import { buildIncomeExpenseReport } from "@/features/reports/services";
import { IncomeExpenseReport } from "@/features/reports/ui";

type Props = {
  financialYearId: string;
};

export async function IncomeExpenseTab({ financialYearId }: Props) {
  const report = await buildIncomeExpenseReport(financialYearId);

  const hasStatementData =
    report.statement.income.total > 0 || report.statement.expense.total > 0;

  if (report.months.length === 0 && !hasStatementData) {
    return <Alert severity="info">No transactions found.</Alert>;
  }

  return <IncomeExpenseReport report={report} />;
}
