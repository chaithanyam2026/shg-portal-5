"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Card, CardContent, Stack, Typography } from "@mui/material";

import type { IncomeSummary } from "../types";

import IncomeTable from "./IncomeTable";

type Props = {
  meetingId: string;
  initialSummary: IncomeSummary;
};

export default function IncomeForm({ meetingId, initialSummary }: Props) {
  const router = useRouter();

  const [records, setRecords] = useState(initialSummary.records);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const totalIncome = useMemo(
    () => records.reduce((sum, record) => sum + record.amount, 0),
    [records],
  );

  async function save() {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/meetings/${meetingId}/income`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otherIncomes: records,
        }),
      });

      if (!response.ok) {
        const body = await response.json();

        throw new Error(body.message ?? "Unable to save income.");
      }

      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save income.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <IncomeTable records={records} disabled={saving} onChange={setRecords} />

      <Card>
        <CardContent>
          <Typography variant="h6">Total Income: ₹{totalIncome}</Typography>
        </CardContent>
      </Card>

      <Button variant="contained" disabled={saving} onClick={save}>
        Save Income
      </Button>
    </Stack>
  );
}
