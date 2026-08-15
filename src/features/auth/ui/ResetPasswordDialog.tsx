"use client";

import { useState, useTransition } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { UserListItem } from "@/features/auth/services/list";

type Props = {
  user: UserListItem | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ResetPasswordDialog({ user, onClose, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setPassword("");
    setConfirmPassword("");
    setError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    startTransition(async () => {
      try {
        setError(null);

        const response = await fetch(`/api/users/${user._id}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, confirmPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message ?? "Unable to reset password.");
          return;
        }

        resetForm();
        onSuccess();
      } catch {
        setError("Unable to reset password.");
      }
    });
  }

  return (
    <Dialog open={user !== null} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Reset Password</DialogTitle>

      <DialogContent>
        <Stack component="form" id="reset-password-form" spacing={2} sx={{ mt: 1 }} onSubmit={handleSubmit}>
          {user && (
            <Typography color="text.secondary">
              Set a new password for <strong>{user.username}</strong>.
            </Typography>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
            fullWidth
            disabled={isPending}
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
            fullWidth
            disabled={isPending}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>

        <Button type="submit" form="reset-password-form" variant="contained" disabled={isPending}>
          {isPending ? "Saving..." : "Reset Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
