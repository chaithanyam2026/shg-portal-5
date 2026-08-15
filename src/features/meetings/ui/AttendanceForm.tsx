"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Stack } from "@mui/material";

import type { AttendanceRecord } from "../types";

import AttendanceTable from "./AttendanceTable";

type Props = {
  meetingId: string;

  initialRecords: AttendanceRecord[];
};

export default function AttendanceForm({ meetingId, initialRecords }: Props) {
  const router = useRouter();

  const [records, setRecords] = useState(initialRecords);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  async function save() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(`/api/meetings/${meetingId}/attendance`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          attendance: records,
        }),
      });

      if (!response.ok) {
        const body = await response.json();

        throw new Error(body.message ?? "Unable to save attendance.");
      }

      setMessage("Attendance saved successfully.");

      router.refresh();
    } catch (error) {
      setMessage("");
      setError(error instanceof Error ? error.message : "Unable to save attendance.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      {message && <Alert severity="success">{message}</Alert>}

      <AttendanceTable records={records} disabled={saving} onChange={setRecords} />

      <Button variant="contained" onClick={save} disabled={saving}>
        Save Attendance
      </Button>
    </Stack>
  );
}
