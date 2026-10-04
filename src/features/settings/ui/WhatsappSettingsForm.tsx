"use client";

import { useState, useTransition } from "react";

import {
  Alert,
  Card,
  CardContent,
  FormControlLabel,
  Snackbar,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";

type Props = {
  enabled: boolean;
};

export default function WhatsappSettingsForm({ enabled }: Props) {
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleChange(next: boolean) {
    const previous = checked;
    setChecked(next);
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/settings/whatsapp", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ whatsappMeetingCloseEnabled: next }),
        });
        const data = await response.json();

        if (!response.ok) {
          setChecked(previous);
          setError(data.message ?? "Unable to update WhatsApp settings.");
          return;
        }

        setChecked(Boolean(data.whatsappMeetingCloseEnabled));
        setMessage(next ? "WhatsApp messages are on." : "WhatsApp messages are off.");
      } catch {
        setChecked(previous);
        setError("Unable to update WhatsApp settings.");
      }
    });
  }

  return (
    <>
      <Stack spacing={3}>
        <PageHeader title="WhatsApp" subtitle="Meeting close messages" backHref="/" />

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography color="text.secondary">
                When this is on, closing a meeting sends one WhatsApp summary of that meeting. Only
                administrators can change this switch.
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}

              <FormControlLabel
                control={
                  <Switch
                    checked={checked}
                    disabled={isPending}
                    onChange={(event) => handleChange(event.target.checked)}
                  />
                }
                label={checked ? "WhatsApp messages on" : "WhatsApp messages off"}
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Snackbar open={message !== null} autoHideDuration={4000} onClose={() => setMessage(null)}>
        <Alert severity="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
