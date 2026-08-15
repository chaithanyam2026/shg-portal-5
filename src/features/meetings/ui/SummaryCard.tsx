"use client";

import { Card, CardContent, Stack, Typography } from "@mui/material";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function SummaryCard({ title, children }: Props) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack spacing={1.25}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>

          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}
