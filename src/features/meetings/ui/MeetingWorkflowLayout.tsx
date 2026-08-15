"use client";

import type { ReactNode, SyntheticEvent } from "react";

import { Stack } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";

import type { MeetingStatus } from "../domain/meeting-status";

import MeetingTabs from "./MeetingTabs";

type Props = {
  children: ReactNode;
  meetingId: string;
  status: MeetingStatus;
  title: string;
  tab: number;
  onTabChange: (event: SyntheticEvent, value: number) => void;
};

export default function MeetingWorkflowLayout({
  meetingId,
  status,
  title,
  children,
  tab,
  onTabChange,
}: Props) {
  return (
    <Stack spacing={3}>
      <PageHeader title={title} backHref={`/meetings/${meetingId}`} />

      <MeetingTabs value={tab} status={status} onChange={onTabChange} />

      {children}
    </Stack>
  );
}
