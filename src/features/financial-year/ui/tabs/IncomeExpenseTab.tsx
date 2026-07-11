import { Alert } from "@mui/material";

import { buildIncomeExpenseReport } from "@/features/reports/services";
import { IncomeExpenseReport } from "@/features/reports/ui";

type Props = {
  financialYearId: string;
};

export async function IncomeExpenseTab({
  financialYearId,
}: Props) {
  const report = await buildIncomeExpenseReport(
    financialYearId,
  );

  if (report.months.length === 0) {
    return (
      <Alert severity="info">
        No transactions found.
      </Alert>
    );
  }

  return (
    <IncomeExpenseReport
      report={report}
    />
  );
}