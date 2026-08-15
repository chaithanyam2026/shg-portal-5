import { Grid, Stack } from "@mui/material";

import type { IncomeExpenseStatement } from "../domain/income-expense-statement";
import { IncomeExpenseStatementSection } from "./IncomeExpenseStatementSection";

type Props = {
  statement: IncomeExpenseStatement;
};

export function IncomeExpenseStatementView({ statement }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <IncomeExpenseStatementSection
          title="Income"
          section={statement.income}
          emptyMessage="No income recorded in closed meetings for this financial year."
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <IncomeExpenseStatementSection
          title="Expense"
          section={statement.expense}
          emptyMessage="No expenses recorded in closed meetings for this financial year."
        />
      </Grid>
    </Grid>
  );
}
