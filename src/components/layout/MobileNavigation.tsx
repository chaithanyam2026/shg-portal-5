"use client";

import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";

import { Box, IconButton } from "@mui/material";

import Sidebar from "./Sidebar";

type Props = {
  userRole?: string;
};

export default function MobileNavigation({ userRole }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box sx={{ display: { xs: "inline-flex", md: "none" } }}>
        <IconButton color="default" onClick={() => setOpen(true)} aria-label="Open navigation menu">
          <MenuIcon />
        </IconButton>
      </Box>

      <Sidebar mobile mobileOpen={open} onClose={() => setOpen(false)} userRole={userRole} />
    </>
  );
}
