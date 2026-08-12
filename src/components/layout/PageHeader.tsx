"use client";

import type { ReactNode } from "react";

import { Box, Stack, Typography } from "@mui/material";

import BackButton from "./BackButton";

type Props = {
  title: string;

  subtitle?: string;

  showBack?: boolean;

  backHref?: string;

  children?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  showBack = true,
  backHref = "/",
  children,
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
            md: "flex-start",
          },
        }}
      >
        <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          {showBack && (
            <Box sx={{ alignSelf: "flex-start" }}>
              <BackButton fallbackHref={backHref} />
            </Box>
          )}

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

        {children && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
              justifyContent: {
                xs: "flex-start",
                md: "flex-end",
              },
              width: {
                xs: "100%",
                md: "auto",
              },
            }}
          >
            {children}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
