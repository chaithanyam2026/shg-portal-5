"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

type Props = {
  allowed: boolean;
  reason: string | null;
};

export default function NewFinancialYearButton({ allowed, reason }: Props) {
  const [open, setOpen] = useState(false);

  if (allowed) {
    return (
      <Link href="/financial-years/new" style={{ textDecoration: "none" }}>
        <Button variant="contained">New</Button>
      </Link>
    );
  }

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-disabled="true"
        aria-label="New financial year is unavailable. Activate to see why."
        style={{
          display: "inline-flex",
          cursor: "not-allowed",
        }}
      >
        <Button variant="contained" disabled sx={{ pointerEvents: "none" }}>
          New
        </Button>
      </span>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cannot create a financial year</DialogTitle>

        <DialogContent>
          <Typography>{reason}</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
