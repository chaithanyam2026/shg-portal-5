"use client";

import { type SyntheticEvent, useMemo, useState } from "react";

import Link from "next/link";

import { Box, Button, Stack } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";

import type { MeetingDetails } from "../types";

import MeetingActionButton from "./MeetingActionButton";
import MeetingGeneralPanel from "./MeetingGeneralPanel";
import {
  AttendanceTabPanel,
  BankTabPanel,
  ExpensesTabPanel,
  IncomeTabPanel,
  LoansTabPanel,
  MembersTabPanel,
  PaymentsTabPanel,
  SummaryTabPanel,
} from "./MeetingTabPanels";
import MeetingTabs, { resolveMeetingTabIndex } from "./MeetingTabs";

type Props = {
  meeting: MeetingDetails;
  initialTab?: string | null;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function MeetingWorkspace({ meeting, initialTab }: Props) {
  const initialTabIndex = resolveMeetingTabIndex(initialTab);
  const [tab, setTab] = useState(initialTabIndex);
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([initialTabIndex]));

  function handleTabChange(_event: SyntheticEvent, value: number) {
    setTab(value);
    setVisitedTabs((previous) => {
      const next = new Set(previous);
      next.add(value);
      return next;
    });
  }

  const panelSx = useMemo(
    () => (index: number) => ({
      display: tab === index ? "block" : "none",
    }),
    [tab],
  );

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Meeting"
        subtitle={formatDate(meeting.meetingDate)}
        backHref="/meetings"
      >
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Link href={`/meetings/${meeting.id}/edit`} style={{ textDecoration: "none" }}>
            <Button variant="outlined">Edit</Button>
          </Link>

          <MeetingActionButton
            meetingId={meeting.id}
            action="start"
            label="Start Meeting"
            color="success"
            disabled={meeting.status !== "DRAFT"}
          />

          <MeetingActionButton
            meetingId={meeting.id}
            action="delete"
            label="Delete Meeting"
            color="error"
            variant="outlined"
            confirm
            disabled={meeting.status !== "DRAFT"}
          />

          <MeetingActionButton
            meetingId={meeting.id}
            action="close"
            label="Close Meeting"
            color="warning"
            disabled={meeting.status !== "IN_PROGRESS"}
          />
        </Stack>
      </PageHeader>

      <MeetingTabs value={tab} status={meeting.status} onChange={handleTabChange} />

      <Box sx={panelSx(0)}>
        <MeetingGeneralPanel meeting={meeting} />
      </Box>

      {visitedTabs.has(1) && (
        <Box sx={panelSx(1)}>
          <AttendanceTabPanel meetingId={meeting.id} />
        </Box>
      )}

      {visitedTabs.has(2) && (
        <Box sx={panelSx(2)}>
          <PaymentsTabPanel meetingId={meeting.id} />
        </Box>
      )}

      {visitedTabs.has(3) && (
        <Box sx={panelSx(3)}>
          <LoansTabPanel meetingId={meeting.id} />
        </Box>
      )}

      {visitedTabs.has(4) && (
        <Box sx={panelSx(4)}>
          <BankTabPanel meetingId={meeting.id} />
        </Box>
      )}

      {visitedTabs.has(5) && (
        <Box sx={panelSx(5)}>
          <IncomeTabPanel meetingId={meeting.id} />
        </Box>
      )}

      {visitedTabs.has(6) && (
        <Box sx={panelSx(6)}>
          <ExpensesTabPanel meetingId={meeting.id} />
        </Box>
      )}

      {visitedTabs.has(7) && (
        <Box sx={panelSx(7)}>
          <MembersTabPanel meetingId={meeting.id} />
        </Box>
      )}

      {visitedTabs.has(8) && (
        <Box sx={panelSx(8)}>
          <SummaryTabPanel meetingId={meeting.id} />
        </Box>
      )}
    </Stack>
  );
}
