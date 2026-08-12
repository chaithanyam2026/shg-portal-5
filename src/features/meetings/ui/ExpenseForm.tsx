"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Card, CardContent, Stack, Typography } from "@mui/material";

import type { ExpenseSummary } from "../types";

import ExpenseTable from "./ExpenseTable";

type Props = {
  meetingId: string;
  initialSummary: ExpenseSummary;
};

export default function ExpenseForm({ meetingId, initialSummary }: Props) {
  const router = useRouter();

  const [records, setRecords] = useState(initialSummary.records);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const totalExpense = useMemo(
    () => records.reduce((sum, record) => sum + record.amount, 0),
    [records],
  );

  async function save() {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/meetings/${meetingId}/expenses`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expenses: records,
        }),
      });

      if (!response.ok) {
        const body = await response.json();

        throw new Error(body.message ?? "Unable to save expenses.");
      }

      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save expenses.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <ExpenseTable records={records} disabled={saving} onChange={setRecords} />

      <Card>
        <CardContent>
          <Typography variant="h6">Total Expense: ₹{totalExpense}</Typography>
        </CardContent>
      </Card>

      <Button variant="contained" disabled={saving} onClick={save}>
        Save Expenses
      </Button>
    </Stack>
  );
}
