"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Stack } from "@mui/material";

import type { MemberLookup } from "@/features/financial-year/types";
import { Snackbar } from "@mui/material";

import type { CreateLoanInput } from "../validation";

import LoanForm from "./LoanForm";

type Props = {
  financialYearId: string;

  members: MemberLookup[];
};

export default function NewLoanPage({ financialYearId, members }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(values: CreateLoanInput) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/loans", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to create loan.");
      }

      setSuccess(true);

      setTimeout(() => {
        router.push(`/loans/${result._id}`);

        router.refresh();
      }, 600);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to create loan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      <Snackbar open={success} autoHideDuration={1500} message="Loan created successfully." />
      <LoanForm
        financialYearId={financialYearId}
        members={members}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}
