"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Stack, TextField } from "@mui/material";

import { parseDateInputValue, toDateInputValue } from "@/lib/utils/date";

import type { LoanDetails } from "../types";

type Props = {
  loan: LoanDetails;
};

export default function SetLoanClosedDateForm({ loan }: Props) {
  const router = useRouter();

  const [closedDate, setClosedDate] = useState(toDateInputValue(new Date()));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setError("");
    setSuccess("");

    if (!closedDate) {
      setError("Please select the loan close date.");
      return;
    }

    if (parseDateInputValue(closedDate) < parseDateInputValue(toDateInputValue(loan.disbursedDate))) {
      setError("Close date cannot be before the loan start date.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/loans/${loan._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          closedDate: parseDateInputValue(closedDate),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save the close date.");
      }

      setSuccess("Close date saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save the close date.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={1.5}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          alignItems: {
            sm: "flex-start",
          },
        }}
      >
        <TextField
          label="Close Date"
          type="date"
          fullWidth
          required
          value={closedDate}
          onChange={(event) => setClosedDate(event.target.value)}
          helperText="Repayments after this date are not included in the passbook."
          disabled={loading}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <Button
          variant="contained"
          onClick={save}
          disabled={loading || !closedDate}
          sx={{
            minWidth: 120,
            mt: {
              sm: 1,
            },
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Stack>
    </Stack>
  );
}
