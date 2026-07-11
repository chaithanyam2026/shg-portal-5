"use client";

import {
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function SummaryCard({
  title,
  children,
}: Props) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">
            {title}
          </Typography>

          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}