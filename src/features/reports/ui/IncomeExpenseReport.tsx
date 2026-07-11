import { Alert, Stack } from "@mui/material";

import type { IncomeExpenseReport as IncomeExpenseReportModel } from "../types";
import { IncomeExpenseSummary } from "./IncomeExpenseSummary";
import { MonthlyLedgerSection } from "./MonthlyLedgerSection";

type Props = {
  report: IncomeExpenseReportModel;
};

export function IncomeExpenseReport({
  report,
}: Props) {
  if (report.months.length === 0) {
    return (
      <Alert severity="info">
        No transactions found.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <IncomeExpenseSummary
        openingBalance={report.openingBalance}
        closingBalance={report.closingBalance}
        totalIncome={report.totalIncome}
        totalExpense={report.totalExpense}
      />

      {report.months.map((ledger) => (
        <MonthlyLedgerSection
          key={`${ledger.year}-${ledger.month}`}
          ledger={ledger}
        />
      ))}
    </Stack>
  );
}