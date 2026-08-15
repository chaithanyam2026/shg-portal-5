"use client";

import { useState, useTransition } from "react";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        setError(null);

        const response = await fetch("/api/account/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message ?? "Unable to change password.");
          return;
        }

        resetForm();
        setMessage(data.message ?? "Password changed successfully.");
      } catch {
        setError("Unable to change password.");
      }
    });
  }

  return (
    <>
      <Stack spacing={3}>
        <PageHeader title="Change Password" backHref="/" />

        <Card>
          <CardContent>
            <Stack component="form" spacing={3} onSubmit={handleSubmit}>
              <Typography color="text.secondary">
                Update your own login password. Only administrators can reset passwords for other
                users.
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                required
                fullWidth
                disabled={isPending}
              />

              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                required
                fullWidth
                disabled={isPending}
              />

              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                required
                fullWidth
                disabled={isPending}
              />

              <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
                <Button type="button" variant="outlined" onClick={resetForm} disabled={isPending}>
                  Clear
                </Button>

                <Button type="submit" variant="contained" disabled={isPending}>
                  {isPending ? "Saving..." : "Change Password"}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={message !== null}
        autoHideDuration={4000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
