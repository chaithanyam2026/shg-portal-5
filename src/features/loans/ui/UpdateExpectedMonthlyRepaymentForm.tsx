"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Stack } from "@mui/material";

import type { LoanDetails } from "../types";
import MinimumMonthlyRepaymentField from "./MinimumMonthlyRepaymentField";

type Props = {
  loan: LoanDetails;
};

export default function UpdateExpectedMonthlyRepaymentForm({ loan }: Props) {
  const router = useRouter();

  const [value, setValue] = useState(loan.expectedMonthlyRepayment);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isUnchanged = value === loan.expectedMonthlyRepayment;

  async function save() {
    setError("");
    setSuccess("");

    if (value < 0) {
      setError("Minimum monthly repayment cannot be negative.");
      return;
    }

    if (value > loan.disbursedAmount) {
      setError("Minimum monthly repayment cannot exceed the disbursed amount.");
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
          expectedMonthlyRepayment: value,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to update minimum monthly repayment.");
      }

      setSuccess("Minimum monthly repayment updated.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update minimum monthly repayment.");
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
        <MinimumMonthlyRepaymentField
          disbursedAmount={loan.disbursedAmount}
          value={value}
          onChange={setValue}
          disabled={loading}
          helperText="Changing this updates monthly fine checks"
        />

        <Button
          variant="contained"
          onClick={save}
          disabled={loading || isUnchanged}
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
