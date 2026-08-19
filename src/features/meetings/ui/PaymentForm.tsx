"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Card, CardContent, Stack, Typography } from "@mui/material";

import type { PaymentRecord } from "../types";

import { useMeetingDataRefresh, useMeetingUnsavedSection } from "./MeetingDataRefresh";
import PaymentTable from "./PaymentTable";

type Props = {
  meetingId: string;
  initialRecords: PaymentRecord[];
  initialSaved?: boolean;
  readOnly?: boolean;
};

export default function PaymentForm({
  meetingId,
  initialRecords,
  initialSaved = false,
  readOnly = false,
}: Props) {
  const router = useRouter();
  const { refreshMeetingData } = useMeetingDataRefresh();

  const [records, setRecords] = useState(initialRecords);
  const [baseline, setBaseline] = useState(initialRecords);
  const [saved, setSaved] = useState(initialSaved);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useMeetingUnsavedSection(
    "payments",
    !readOnly && (!saved || JSON.stringify(records) !== JSON.stringify(baseline)),
  );

  const totals = useMemo(() => {
    const contribution = records.reduce((sum, record) => sum + record.contribution, 0);

    const loan = records.reduce((sum, record) => sum + record.loanRepayment, 0);

    const absent = records.reduce((sum, record) => sum + record.absentFine, 0);

    const special = records.reduce((sum, record) => sum + record.specialLoanFine, 0);

    return {
      contribution,
      loan,
      absent,
      special,
      total: contribution + loan + absent + special,
    };
  }, [records]);

  async function save() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/meetings/${meetingId}/payments`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payments: records,
        }),
      });

      if (!response.ok) {
        const body = await response.json();

        throw new Error(body.message ?? "Unable to save payments.");
      }

      setSuccess("Payments saved successfully.");
      setSaved(true);
      setBaseline(records);

      refreshMeetingData();
      router.refresh();
    } catch (error) {
      setSuccess("");
      setError(error instanceof Error ? error.message : "Unable to save payments.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      {success && <Alert severity="success">{success}</Alert>}

      <PaymentTable records={records} disabled={readOnly || saving} onChange={setRecords} />

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography>Contribution: ₹{totals.contribution}</Typography>

            <Typography>Loan Repayment: ₹{totals.loan}</Typography>

            <Typography>Absent Fine: ₹{totals.absent}</Typography>

            {records.some((record) => record.hasSpecialLoan || record.specialLoanFine > 0) && (
              <Typography>Special Loan Fine: ₹{totals.special}</Typography>
            )}

            <Typography variant="h6">Grand Total: ₹{totals.total}</Typography>
          </Stack>
        </CardContent>
      </Card>

      {!readOnly && (
        <Button variant="contained" disabled={saving} onClick={save}>
          Save Payments
        </Button>
      )}
    </Stack>
  );
}
