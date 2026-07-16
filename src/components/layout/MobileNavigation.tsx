"use client";

import {
  useState,
} from "react";

import MenuIcon
  from "@mui/icons-material/Menu";

import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Sidebar from "./Sidebar";

export default function MobileNavigation() {
  const theme =
    useTheme();

  const mobile =
    useMediaQuery(
      theme.breakpoints.down(
        "md",
      ),
    );

  const [
    open,
    setOpen,
  ] = useState(false);

  if (!mobile) {
    return null;
  }

  return (
    <Box>
      <IconButton
        color="inherit"
        onClick={() =>
          setOpen(true)
        }
      >
        <MenuIcon />
      </IconButton>

      <Sidebar
        mobile
        mobileOpen={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </Box>
  );
}