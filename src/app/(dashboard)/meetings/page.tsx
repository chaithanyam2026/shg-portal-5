"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import Link from "next/link";

import MeetingTable from "@/features/meetings/ui/MeetingTable";
import type {
  MeetingListResult,
  MeetingSummary,
} from "@/features/meetings/types";
import PageHeader from "@/components/layout/PageHeader";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMeetings();
  }, []);

  async function loadMeetings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/meetings");

      if (!response.ok) {
        throw new Error("Failed to load meetings.");
      }

      const result: MeetingListResult =
        await response.json();

      setMeetings(result.items);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load meetings.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 3 }}
    >
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <PageHeader
            title="Meetings"
            showBack={false}
          />

         
        </Stack>
         <Button
            component={Link}
            href="/meetings/new"
            variant="contained"
          >
            Create Meeting
          </Button>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <MeetingTable
            meetings={meetings}
          />
        )}
      </Stack>
    </Container>
  );
}