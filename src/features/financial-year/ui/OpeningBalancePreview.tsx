"use client";

import { Card, CardContent, Divider, Grid, Stack, Typography } from "@mui/material";

import type { OpeningBalance } from "../domain";

type Props = {
  opening: OpeningBalance;
};

const ROWS = [
  {
    key: "bankBalance",
    label: "Bank Balance",
  },
  {
    key: "cashInHand",
    label: "Cash In Hand",
  },
  {
    key: "excessCorpus",
    label: "Excess Corpus",
  },
  {
    key: "investments",
    label: "Investments",
  },
  {
    key: "otherLoans",
    label: "Other Loans",
  },
] as const;

export default function OpeningBalancePreview({ opening }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Opening Balances</Typography>

          <Divider />

          <Grid container spacing={2}>
            {ROWS.map((row) => (
              <Grid
                key={row.key}
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    {row.label}
                  </Typography>

                  <Typography variant="h6">₹{opening[row.key].toLocaleString("en-IN")}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}
