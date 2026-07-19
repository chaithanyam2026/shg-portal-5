"use client";

import type { ReactNode } from "react";

import { Box, Stack, Typography } from "@mui/material";

import BackButton from "./BackButton";

type Props = {
  title: string;

  subtitle?: string;

  showBack?: boolean;

  backHref?: string;

  actions?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  showBack = true,
  backHref = "/",
  actions,
}: Props) {
  return (
    <Box
      sx={{
        mb: 3,
      }}
    >
     <Stack
  direction={{
    xs: "column",
    md: "row",
  }}
  spacing={2}
  sx={{
    justifyContent: "space-between",
    alignItems: {
      xs: "stretch",
      md: "center",
    },
  }}
>
        <Stack spacing={1}>
          {showBack && <BackButton fallbackHref={backHref} />}

          <Typography
  variant="h4"
  component="h1"
  sx={{
    fontWeight: 600,
  }}
>
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>

        {actions && (
          <Box
            sx={{
              width: {
                xs: "100%",
                md: "auto",
              },
              display: "flex",
              justifyContent: {
                xs: "flex-start",
                md: "flex-end",
              },
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {actions}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
