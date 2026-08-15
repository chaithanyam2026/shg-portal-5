"use client";

import { useState } from "react";

import { Button, Stack, TextField } from "@mui/material";

import { parseDateInputValue } from "@/lib/utils/date";
import type { CreateMeetingInput } from "../validation";

type MeetingFormValues = {
  meetingDate: string;
  place: string;
  agenda: string;
  remarks: string;
};

type Props = {
  initialValues?: MeetingFormValues;
  loading?: boolean;
  disabled?: boolean;
  onSubmit(values: CreateMeetingInput): Promise<void>;
};

const defaultValues: MeetingFormValues = {
  meetingDate: new Date().toISOString().split("T")[0],
  place: "",
  agenda: "",
  remarks: "",
};

export default function MeetingForm({
  initialValues = defaultValues,
  loading = false,
  disabled = false,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<MeetingFormValues>(initialValues);

  function update<K extends keyof MeetingFormValues>(key: K, value: MeetingFormValues[K]) {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      meetingDate: parseDateInputValue(values.meetingDate),
      place: values.place.trim(),
      agenda: values.agenda.trim(),
      remarks: values.remarks.trim(),
    });
  }

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <TextField
        label="Meeting Date"
        type="date"
        required
        fullWidth
        disabled={disabled}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        value={values.meetingDate}
        onChange={(event) => update("meetingDate", event.target.value)}
      />

      <TextField
        label="Place"
        fullWidth
        disabled={disabled}
        value={values.place}
        onChange={(event) => update("place", event.target.value)}
      />

      <TextField
        label="Agenda"
        fullWidth
        disabled={disabled}
        multiline
        minRows={3}
        value={values.agenda}
        onChange={(event) => update("agenda", event.target.value)}
      />

      <TextField
        label="Remarks"
        fullWidth
        disabled={disabled}
        multiline
        minRows={3}
        value={values.remarks}
        onChange={(event) => update("remarks", event.target.value)}
      />

      <Button type="submit" variant="contained" disabled={disabled || loading}>
        Save Meeting
      </Button>
    </Stack>
  );
}
