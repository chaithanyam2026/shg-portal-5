import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";

import { formatCurrency } from "@/lib/utils/currency";

import type { RunningBalance } from "../types";

type Props = {
  openingBalance: RunningBalance;
  closingBalance: RunningBalance;
  totalIncome: number;
  totalExpense: number;
};

type SummaryCardProps = {
  title: string;
  value: number;
  subtitle?: string;
};

function SummaryCard({ title, value, subtitle }: SummaryCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>

          <Typography variant="h5" fontWeight={700}>
            {formatCurrency(value)}
          </Typography>

          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function IncomeExpenseSummary({
  openingBalance,
  closingBalance,
  totalIncome,
  totalExpense,
}: Props) {
  const netCashFlow = totalIncome - totalExpense;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SummaryCard title="Opening Cash" value={openingBalance.cashInHand} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SummaryCard title="Opening Bank" value={openingBalance.bankBalance} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SummaryCard title="Total Income" value={totalIncome} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SummaryCard title="Total Expense" value={totalExpense} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <SummaryCard title="Closing Cash" value={closingBalance.cashInHand} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <SummaryCard title="Closing Bank" value={closingBalance.bankBalance} />
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <SummaryCard title="Net Cash Flow" value={netCashFlow} subtitle="Income − Expense" />
      </Grid>
    </Grid>
  );
}
