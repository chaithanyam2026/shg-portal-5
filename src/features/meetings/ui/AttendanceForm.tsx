"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Stack } from "@mui/material";

import type { AttendanceRecord } from "../types";

import AttendanceTable from "./AttendanceTable";
import { useMeetingDataRefresh, useMeetingUnsavedSection } from "./MeetingDataRefresh";

type Props = {
  meetingId: string;

  initialRecords: AttendanceRecord[];

  initialSaved?: boolean;

  readOnly?: boolean;
};

export default function AttendanceForm({
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

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  useMeetingUnsavedSection(
    "attendance",
    !readOnly && (!saved || JSON.stringify(records) !== JSON.stringify(baseline)),
  );

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
      setSaved(true);
      setBaseline(records);

      refreshMeetingData();
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

      <AttendanceTable records={records} disabled={readOnly || saving} onChange={setRecords} />

      {!readOnly && (
        <Button variant="contained" onClick={save} disabled={saving}>
          Save Attendance
        </Button>
      )}
    </Stack>
  );
}
