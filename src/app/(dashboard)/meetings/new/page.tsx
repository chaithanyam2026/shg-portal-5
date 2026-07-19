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

  async function handleSubmit(values: CreateMeetingInput) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/meetings", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = await response.json();

        throw new Error(body.message ?? "Unable to create meeting.");
      }

      router.push("/meetings");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to create meeting.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <PageHeader title="New Meeting" backHref="/meetings" />

        {error && <Alert severity="error">{error}</Alert>}

        <MeetingForm loading={loading} onSubmit={handleSubmit} />
      </Stack>
    </Container>
  );
}
