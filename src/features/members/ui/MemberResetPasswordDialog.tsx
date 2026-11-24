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

type MemberResetTarget = {
  _id: string;
  name: string;
};

type Props = {
  member: MemberResetTarget | null;
  onClose(): void;
  onSuccess(): void;
};

export default function MemberResetPasswordDialog({ member, onClose, onSuccess }: Props) {
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
    if (isPending) {
      return;
    }

    resetForm();
    onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!member || isPending) {
      return;
    }

    startTransition(async () => {
      try {
        setError(null);

        const response = await fetch(`/api/members/${member._id}/reset-password`, {
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
    <Dialog open={member !== null} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Reset Password</DialogTitle>

      <DialogContent>
        <Stack
          component="form"
          id="member-reset-password-form"
          spacing={2}
          sx={{ mt: 1 }}
          onSubmit={handleSubmit}
        >
          {member && (
            <Typography color="text.secondary">
              Set a new password for <strong>{member.name}</strong>.
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
            helperText="At least 8 characters."
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

        <Button
          type="submit"
          form="member-reset-password-form"
          variant="contained"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Reset Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
