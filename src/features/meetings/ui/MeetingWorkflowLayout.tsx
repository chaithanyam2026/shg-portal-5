import type { ReactNode } from "react";

import { Stack } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";

import type { MeetingStatus } from "../domain/meeting-status";

import MeetingTabs from "./MeetingTabs";

type Props = {
  children: ReactNode;

  meetingId: string;

  status: MeetingStatus;

  title: string;
};

export default function MeetingWorkflowLayout({ meetingId, status, title, children }: Props) {
  return (
    <Stack spacing={3}>
      <PageHeader title={title} backHref={`/meetings/${meetingId}`} />

      <MeetingTabs meetingId={meetingId} status={status} />

      {children}
    </Stack>
  );
}
