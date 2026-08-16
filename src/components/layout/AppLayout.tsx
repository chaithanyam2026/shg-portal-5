"use client";

import Link from "next/link";

import { useTransition } from "react";

import type { PropsWithChildren } from "react";

import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";

import { logoutAction } from "@/app/logout/actions";
import AppLogo from "@/components/layout/AppLogo";
import type { DashboardNavLink } from "@/lib/navigation";

import MobileNavigation from "./MobileNavigation";
import Sidebar, { DRAWER_WIDTH } from "./Sidebar";

type Props = PropsWithChildren<{
  displayName?: string;
  navItems: DashboardNavLink[];
}>;

export default function AppLayout({ children, displayName, navItems }: Props) {
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
      <AppBar
        position="fixed"
        elevation={1}
        color="inherit"
        sx={{
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AppLogo height={44} />
          </Box>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center", ml: "auto" }}>
            {displayName && (
              <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                Welcome {displayName}
              </Typography>
            )}

            <Button
              component={Link}
              href="/account/profile"
              color="primary"
              size="small"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              My Profile
            </Button>

            <Button
              component={Link}
              href="/account/change-password"
              color="primary"
              size="small"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Change Password
            </Button>

            <Button color="primary" size="small" onClick={handleLogout} disabled={isPending}>
              {isPending ? "Signing Out..." : "Sign Out"}
            </Button>

            <MobileNavigation navItems={navItems} />
          </Stack>
        </Toolbar>
      </AppBar>

      <Sidebar navItems={navItems} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: "background.default",
        }}
      >
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
}
