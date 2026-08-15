"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Stack, TextField } from "@mui/material";

import { loginAction } from "@/app/login/actions";

type Props = {
  callbackUrl?: string;
};

function getSafeCallbackUrl(callbackUrl?: string): string {
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return "/";
  }

  return callbackUrl;
}

export default function LoginForm({ callbackUrl }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    startTransition(async () => {
      try {
        const result = await loginAction({
          username,
          password,
        });

        if (!result.success) {
          setError(result.error);
          return;
        }

        router.replace(getSafeCallbackUrl(callbackUrl));
        router.refresh();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <Stack component="form" spacing={3} onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        autoComplete="username"
        autoFocus
        fullWidth
        required
        disabled={isPending}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        fullWidth
        required
        disabled={isPending}
      />

      <Button type="submit" variant="contained" size="large" fullWidth disabled={isPending}>
        {isPending ? "Signing In..." : "Sign In"}
      </Button>
    </Stack>
  );
}
