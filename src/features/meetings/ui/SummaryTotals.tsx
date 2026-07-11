"use client";

import {
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  rows: {
    label: string;
    value: string | number;
  }[];
};

export default function SummaryTotals({
  rows,
}: Props) {
  return (
    <Stack spacing={1}>
      {rows.map((row) => (
        <Stack
          key={row.label}
          direction="row"
          justifyContent="space-between"
        >
          <Typography>
            {row.label}
          </Typography>

          <Typography
            fontWeight={600}
          >
            {row.value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}