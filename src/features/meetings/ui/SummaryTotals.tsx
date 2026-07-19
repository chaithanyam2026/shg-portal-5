"use client";

import { Stack, Typography } from "@mui/material";

type Props = {
  rows: {
    label: string;
    value: string | number;
  }[];
};

export default function SummaryTotals({ rows }: Props) {
  return (
    <Stack spacing={1}>
      {rows.map((row) => (
        <Stack
          key={row.label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>{row.label}</Typography>

          <Typography fontWeight={600}>{row.value}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}
