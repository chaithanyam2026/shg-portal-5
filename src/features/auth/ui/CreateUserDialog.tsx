"use client";

import { useState, useTransition } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import { ROLE_LABELS, USER_ROLE_VALUES, type UserRole } from "@/lib/auth/roles";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateUserDialog({ open, onClose, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setUsername("");
    setPassword("");
    setRole("MEMBER");
    setError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        setError(null);

        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, role }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message ?? "Unable to create user.");
          return;
        }

        resetForm();
        onSuccess();
      } catch {
        setError("Unable to create user.");
      }
    });
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>New User</DialogTitle>

      <DialogContent>
        <Stack component="form" id="create-user-form" spacing={2} sx={{ mt: 1 }} onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
            fullWidth
            disabled={isPending}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
            fullWidth
            disabled={isPending}
          />

          <FormControl fullWidth disabled={isPending}>
            <InputLabel id="create-user-role-label">Access Level</InputLabel>
            <Select
              labelId="create-user-role-label"
              label="Access Level"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              {USER_ROLE_VALUES.map((item) => (
                <MenuItem key={item} value={item}>
                  {ROLE_LABELS[item]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>

        <Button type="submit" form="create-user-form" variant="contained" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
