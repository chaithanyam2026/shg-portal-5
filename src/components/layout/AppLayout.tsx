"use client";

import type { PropsWithChildren } from "react";

import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MobileNavigation from "./MobileNavigation";
import Sidebar, { DRAWER_WIDTH } from "./Sidebar";

type Props = PropsWithChildren;

/**
 * Common application layout.
 */
export default function AppLayout({ children }: Props) {
  const theme = useTheme();

  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: mobile ? "100%" : `calc(100% - ${DRAWER_WIDTH}px)`,

          ml: mobile ? 0 : `${DRAWER_WIDTH}px`,
        }}
      >
        <Toolbar>
          <MobileNavigation />

          <Typography
            variant="h6"
            component="h1"
            sx={{
              ml: 1,
              flexGrow: 1,
            }}
          >
            SHG Portal
          </Typography>
        </Toolbar>
      </AppBar>

      {!mobile && <Sidebar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,

          width: mobile ? "100%" : `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
      >
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
}
