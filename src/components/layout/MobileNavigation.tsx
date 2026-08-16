"use client";

import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";

import { Box, IconButton } from "@mui/material";

import type { DashboardNavLink } from "@/lib/navigation";

import Sidebar from "./Sidebar";

type Props = {
  navItems: DashboardNavLink[];
};

export default function MobileNavigation({ navItems }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box sx={{ display: { xs: "inline-flex", md: "none" } }}>
        <IconButton color="default" onClick={() => setOpen(true)} aria-label="Open navigation menu">
          <MenuIcon />
        </IconButton>
      </Box>

      <Sidebar mobile mobileOpen={open} onClose={() => setOpen(false)} navItems={navItems} />
    </>
  );
}
