"use client";

import { useState } from "react";

import { Button, Stack, TextField } from "@mui/material";

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
  onSubmit(values: CreateMeetingInput): Promise<void>;
};

const defaultValues: MeetingFormValues = {
  meetingDate: "",
  place: "",
  agenda: "",
  remarks: "",
};

export default function MeetingForm({
  initialValues = defaultValues,
  loading = false,
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
      meetingDate: new Date(values.meetingDate),
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
        required
        fullWidth
        value={values.place}
        onChange={(event) => update("place", event.target.value)}
      />

      <TextField
        label="Agenda"
        fullWidth
        multiline
        minRows={3}
        value={values.agenda}
        onChange={(event) => update("agenda", event.target.value)}
      />

      <TextField
        label="Remarks"
        fullWidth
        multiline
        minRows={3}
        value={values.remarks}
        onChange={(event) => update("remarks", event.target.value)}
      />

      <Button type="submit" variant="contained" disabled={loading}>
        Save Meeting
      </Button>
    </Stack>
  );
}
