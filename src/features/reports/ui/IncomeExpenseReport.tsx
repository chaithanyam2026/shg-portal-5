import { Alert, Stack, Typography } from "@mui/material";

import type { IncomeExpenseReport as IncomeExpenseReportModel } from "../types";
import { IncomeExpenseStatementView } from "./IncomeExpenseStatementView";
import { IncomeExpenseSummary } from "./IncomeExpenseSummary";
import { MonthlyLedgerSection } from "./MonthlyLedgerSection";

type Props = {
  report: IncomeExpenseReportModel;
};

export function IncomeExpenseReport({ report }: Props) {
  const netSurplus = report.statement.income.total - report.statement.expense.total;

  return (
    <Stack spacing={3}>
      <IncomeExpenseSummary
        openingBalance={report.openingBalance}
        closingBalance={report.closingBalance}
        totalIncome={report.statement.income.total}
        totalExpense={report.statement.expense.total}
        netSurplus={netSurplus}
      />

      <IncomeExpenseStatementView statement={report.statement} />

      <Stack spacing={2}>
        <Typography variant="h6">Cash Book</Typography>

        <Typography variant="body2" color="text.secondary">
          Monthly cash and bank movement including contributions, loan repayments, meeting expenses,
          and bank transactions on their actual transaction dates.
        </Typography>

        {report.months.length === 0 ? (
          <Alert severity="info">No cash book transactions found for this financial year.</Alert>
        ) : (
          report.months.map((ledger) => (
            <MonthlyLedgerSection key={`${ledger.year}-${ledger.month}`} ledger={ledger} />
          ))
        )}
      </Stack>
    </Stack>
  );
}
