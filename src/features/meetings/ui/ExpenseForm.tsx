"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Card, CardContent, Stack, Typography } from "@mui/material";

import type { ExpenseSummary } from "../types";

import ExpenseTable from "./ExpenseTable";
import { useMeetingDataRefresh } from "./MeetingDataRefresh";

type Props = {
  meetingId: string;
  initialSummary: ExpenseSummary;
  readOnly?: boolean;
};

export default function ExpenseForm({ meetingId, initialSummary, readOnly = false }: Props) {
  const router = useRouter();
  const { refreshMeetingData } = useMeetingDataRefresh();

  const [records, setRecords] = useState(initialSummary.records);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalExpense = useMemo(
    () => records.reduce((sum, record) => sum + record.amount, 0),
    [records],
  );

  async function save() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

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

      setSuccess("Expenses saved successfully.");

      refreshMeetingData();
      router.refresh();
    } catch (error) {
      setSuccess("");
      setError(error instanceof Error ? error.message : "Unable to save expenses.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      {success && <Alert severity="success">{success}</Alert>}

      <ExpenseTable records={records} disabled={readOnly || saving} onChange={setRecords} />

      <Card>
        <CardContent>
          <Typography variant="h6">Total Expense: ₹{totalExpense}</Typography>
        </CardContent>
      </Card>

      {!readOnly && (
        <Button variant="contained" disabled={saving} onClick={save}>
          Save Expenses
        </Button>
      )}
    </Stack>
  );
}
