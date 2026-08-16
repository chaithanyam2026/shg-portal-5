"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button, ButtonProps } from "@mui/material";

import { useMeetingDataRefresh } from "./MeetingDataRefresh";

type Props = {
  meetingId: string;
  action: "start" | "close" | "delete" | "reopen";
  label: string;
  color?: ButtonProps["color"];
  variant?: ButtonProps["variant"];
  disabled?: boolean;
  confirm?: boolean;
};

export default function MeetingActionButton({
  meetingId,
  action,
  label,
  color = "primary",
  variant = "contained",
  disabled = false,
  confirm = false,
}: Props) {
  const router = useRouter();
  const { refreshMeetingData, unsavedSectionLabels } = useMeetingDataRefresh();

  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (action === "close" && unsavedSectionLabels.length > 0) {
      alert(`Save ${unsavedSectionLabels.join(", ")} before closing the meeting.`);
      return;
    }

    if (confirm) {
      const ok = window.confirm(`Are you sure you want to ${label.toLowerCase()}?`);

      if (!ok) {
        return;
      }
    }

    try {
      setLoading(true);

      const method = action === "delete" ? "DELETE" : "POST";

      const url =
        action === "delete"
          ? `/api/meetings/${meetingId}/delete`
          : `/api/meetings/${meetingId}/${action}`;

      const response = await fetch(url, {
        method,
      });

      if (!response.ok) {
        const body = await response.json();

        throw new Error(body.message ?? `Unable to ${action} meeting.`);
      }

      if (action === "delete") {
        router.push("/meetings");
      } else {
        refreshMeetingData();
        router.refresh();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button color={color} variant={variant} disabled={disabled || loading} onClick={handleClick}>
      {loading ? "Please wait..." : label}
    </Button>
  );
}
