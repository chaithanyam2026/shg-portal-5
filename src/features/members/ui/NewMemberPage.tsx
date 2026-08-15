"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Container, Stack } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";

import type { CreateMemberInput } from "../validation";

import MemberForm from "./MemberForm";

export default function NewMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values: CreateMemberInput) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to create member.");
      }

      router.push(`/members/${result._id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create member.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" disableGutters>
      <Stack spacing={3}>
        <PageHeader title="New Member" backHref="/members" />

        {error && <Alert severity="error">{error}</Alert>}

        <MemberForm loading={loading} onSubmit={handleSubmit} />
      </Stack>
    </Container>
  );
}
