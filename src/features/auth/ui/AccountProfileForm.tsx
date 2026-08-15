"use client";

import Link from "next/link";

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

import type { AccountProfile } from "@/features/members/types";

type Props = {
  initialProfile: AccountProfile;
};

export default function AccountProfileForm({ initialProfile }: Props) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialProfile.name);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [address, setAddress] = useState(initialProfile.address);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function resetForm() {
    setName(initialProfile.name);
    setPhone(initialProfile.phone);
    setAddress(initialProfile.address);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        setError(null);

        const response = await fetch("/api/account/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            address,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message ?? "Unable to update profile.");
          return;
        }

        setName(data.profile.name);
        setPhone(data.profile.phone);
        setAddress(data.profile.address);
        setMessage(data.message ?? "Profile updated successfully.");
      } catch {
        setError("Unable to update profile.");
      }
    });
  }

  return (
    <>
      <Stack spacing={3}>
        <PageHeader title="My Profile" backHref="/" />

        <Card>
          <CardContent>
            <Stack component="form" spacing={3} onSubmit={handleSubmit}>
              <Typography color="text.secondary">
                Update your member profile details. Member code cannot be changed here.
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Member Code"
                value={initialProfile.memberCode}
                fullWidth
                disabled
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />

              <TextField
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                fullWidth
                disabled={isPending}
              />

              <TextField
                label="Phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                fullWidth
                disabled={isPending}
                inputMode="tel"
              />

              <TextField
                label="Address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                fullWidth
                multiline
                minRows={3}
                disabled={isPending}
              />

              <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                <Button component={Link} href="/account/change-password" variant="text">
                  Change Password
                </Button>

                <Stack direction="row" spacing={2}>
                  <Button type="button" variant="outlined" onClick={resetForm} disabled={isPending}>
                    Reset
                  </Button>

                  <Button type="submit" variant="contained" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Profile"}
                  </Button>
                </Stack>
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
