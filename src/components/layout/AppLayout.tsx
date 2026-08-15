"use client";

import Link from "next/link";

import { useTransition } from "react";

import type { PropsWithChildren } from "react";

import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { logoutAction } from "@/app/logout/actions";
import { ROLE_LABELS, type UserRole } from "@/lib/auth/roles";
import { PWA_APP_NAME } from "@/lib/pwa/app-metadata";

import MobileNavigation from "./MobileNavigation";
import Sidebar, { DRAWER_WIDTH } from "./Sidebar";

type Props = PropsWithChildren<{
  username?: string;
  userRole?: UserRole;
}>;

export default function AppLayout({ children, username, userRole = "MEMBER" }: Props) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

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
          <MobileNavigation userRole={userRole} />

          <Typography
            variant="h6"
            component="h1"
            sx={{
              ml: 1,
              flexGrow: 1,
            }}
          >
            {PWA_APP_NAME}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {username && (
              <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                {username}
                {" · "}
                {ROLE_LABELS[userRole] ?? userRole}
              </Typography>
            )}

            <Button
              component={Link}
              href="/account/profile"
              color="inherit"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              My Profile
            </Button>

            <Button
              component={Link}
              href="/account/change-password"
              color="inherit"
              sx={{ display: { xs: "none", lg: "inline-flex" } }}
            >
              Change Password
            </Button>

            <Button color="inherit" onClick={handleLogout} disabled={isPending}>
              {isPending ? "Signing Out..." : "Sign Out"}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {!mobile && <Sidebar userRole={userRole} />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: mobile ? "100%" : `calc(100% - ${DRAWER_WIDTH}px)`,
          bgcolor: "background.default",
        }}
      >
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
}
