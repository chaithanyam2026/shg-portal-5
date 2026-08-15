"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Container, Stack } from "@mui/material";

import MeetingForm from "@/features/meetings/ui/MeetingForm";

import PageHeader from "@/components/layout/PageHeader";
import type { CreateMeetingInput } from "@/features/meetings/validation";

export default function CreateMeetingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(values: CreateMeetingInput) {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/meetings", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to create meeting.");
      }

      setSuccess("Meeting created successfully.");

      window.setTimeout(() => {
        router.push(`/meetings/${body.id}`);
        router.refresh();
      }, 1500);
    } catch (error) {
      setSuccess("");
      setError(error instanceof Error ? error.message : "Unable to create meeting.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" disableGutters>
      <Stack spacing={3}>
        <PageHeader title="New Meeting" backHref="/meetings" />

        {error && <Alert severity="error">{error}</Alert>}

        {success && <Alert severity="success">{success}</Alert>}

        <MeetingForm loading={loading || Boolean(success)} onSubmit={handleSubmit} />
      </Stack>
    </Container>
  );
}
