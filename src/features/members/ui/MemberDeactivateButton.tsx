"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Alert, Button, Snackbar } from "@mui/material";

import type { MemberDetails } from "../types";

type Props = {
  member: MemberDetails;
};

export default function MemberDeactivateButton({ member }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (member.status !== "ACTIVE") {
    return null;
  }

  function handleDeactivate() {
    const confirmed = window.confirm(
      `Deactivate ${member.name}? Their login will also be disabled.`,
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      try {
        setError(null);

        const response = await fetch(`/api/members/${member._id}/deactivate`, {
          method: "POST",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message ?? "Unable to deactivate member.");
          return;
        }

        setMessage("Member deactivated.");
        router.refresh();
      } catch {
        setError("Unable to deactivate member.");
      }
    });
  }

  return (
    <>
      <Button color="error" variant="outlined" disabled={isPending} onClick={handleDeactivate}>
        {isPending ? "Deactivating..." : "Deactivate"}
      </Button>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
