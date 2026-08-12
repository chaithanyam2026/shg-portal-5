"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, CircularProgress, Container, Stack } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import MeetingForm from "@/features/meetings/ui/MeetingForm";

import type { CreateMeetingInput } from "@/features/meetings/validation";

import type { MeetingDetails } from "@/features/meetings/types";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditMeetingPage({ params }: Props) {
  const router = useRouter();

  const [meetingId, setMeetingId] = useState("");

  const [meeting, setMeeting] = useState<MeetingDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function initialize() {
      const { id } = await params;

      setMeetingId(id);

      await loadMeeting(id);
    }

    initialize();
  }, [params]);

  async function loadMeeting(id: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/meetings/${id}`);

      if (!response.ok) {
        throw new Error("Unable to load meeting.");
      }

      const data: MeetingDetails = await response.json();

      setMeeting(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to load meeting.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values: CreateMeetingInput) {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = await response.json();

        throw new Error(body.message ?? "Unable to update meeting.");
      }

      router.push(`/meetings/${meetingId}`);

      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update meeting.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Container maxWidth="sm" disableGutters>
        <Stack
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          spacing={2}
        >
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  if (!meeting) {
    return (
      <Container maxWidth="sm" disableGutters>
        <Alert severity="error">Meeting not found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" disableGutters>
      <Stack spacing={3}>
        <PageHeader title="Edit Meeting" backHref={`/meetings/${meetingId}`} />

        {error && <Alert severity="error">{error}</Alert>}

        <MeetingForm
          loading={saving}
          initialValues={{
            meetingDate: meeting.meetingDate.slice(0, 10),

            place: meeting.place,

            agenda: meeting.agenda,

            remarks: meeting.remarks,
          }}
          onSubmit={handleSubmit}
        />

        <Button variant="outlined" onClick={() => router.push(`/meetings/${meetingId}`)}>
          Cancel
        </Button>
      </Stack>
    </Container>
  );
}
