"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { parseDateInputValue, toDateInputValue } from "@/lib/utils/date";
import { formatDate } from "@/lib/utils/format";

import {
  CHITTY_PAYMENT_LOCK_LABEL,
  canEditChittyPaymentRow,
  isChittyPaymentLocked,
} from "../domain";
import type { ChittyPaymentRecord, ChittyPaymentSheet } from "../types";

import ChittyPaymentTable from "./ChittyPaymentTable";

type Props = {
  initialSheet: ChittyPaymentSheet;
};

export default function ChittyDashboard({ initialSheet }: Props) {
  const [sheet, setSheet] = useState(initialSheet);
  const [records, setRecords] = useState<ChittyPaymentRecord[]>(initialSheet.records);
  const [locked, setLocked] = useState(initialSheet.locked);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    function refreshLock() {
      setLocked(
        isChittyPaymentLocked(new Date(), parseDateInputValue(sheet.date), {
          allowPastEdits: sheet.canEditPast,
        }),
      );
    }

    refreshLock();
    const timer = window.setInterval(refreshLock, 15_000);
    return () => window.clearInterval(timer);
  }, [sheet.date, sheet.canEditPast]);

  async function loadDate(date: string) {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/chitty/payments?date=${encodeURIComponent(date)}`);
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to load chitty payments.");
      }

      setSheet(body);
      setRecords(body.records);
      setLocked(body.locked);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load chitty payments.");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/chitty/payments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: sheet.date,
          records,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to save chitty payments.");
      }

      setSheet(body);
      setRecords(body.records);
      setLocked(body.locked);
      setSuccess("Payments saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save chitty payments.");
    } finally {
      setSaving(false);
    }
  }

  const canSave =
    !locked &&
    !loading &&
    records.some((record) =>
      canEditChittyPaymentRow({
        sheetLocked: locked,
        canEditAll: sheet.canEditAll,
        currentMemberId: sheet.currentMemberId,
        rowMemberId: record.memberId,
      }),
    );

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {locked && (
        <Alert severity="info">
          {toDateInputValue(new Date()) === sheet.date
            ? `Payment entry is closed after ${CHITTY_PAYMENT_LOCK_LABEL}.`
            : "Previous Sundays are read-only, except for admin edits."}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
            >
              <Typography variant="h6">Payments</Typography>

              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>Sunday</InputLabel>
                <Select
                  label="Sunday"
                  value={sheet.date}
                  disabled={loading || saving}
                  onChange={(event) => loadDate(event.target.value)}
                >
                  {sheet.dateOptions.map((date) => (
                    <MenuItem key={date} value={date}>
                      {formatDate(date)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <ChittyPaymentTable
              records={records}
              canEditAll={sheet.canEditAll}
              currentMemberId={sheet.currentMemberId}
              sheetLocked={locked}
              disabled={loading || saving}
              onChange={setRecords}
            />

            {canSave && (
              <Button
                variant="contained"
                disabled={saving}
                onClick={save}
                sx={{ alignSelf: "flex-start" }}
              >
                Save Payments
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
