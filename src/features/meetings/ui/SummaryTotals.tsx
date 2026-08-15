"use client";

import { Box, Typography } from "@mui/material";

type Props = {
  rows: {
    label: string;
    value: string | number;
  }[];
};

export default function SummaryTotals({ rows }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 1,
      }}
    >
      {rows.map((row) => (
        <Box
          key={row.label}
          sx={{
            bgcolor: "action.hover",
            borderRadius: 1,
            px: 1,
            py: 0.75,
            minWidth: 0,
          }}
        >
          <Typography variant="caption" color="text.secondary" noWrap>
            {row.label}
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
            {row.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
