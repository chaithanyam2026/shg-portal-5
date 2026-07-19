"use client";

import { Stack, Typography } from "@mui/material";

type Props = {
  title: string;

  children: React.ReactNode;
};

export default function ReportCategory({ title, children }: Props) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">{title}</Typography>

      {children}
    </Stack>
  );
}
