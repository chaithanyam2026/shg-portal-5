"use client";

import { type SyntheticEvent, useMemo, useState } from "react";

import Link from "next/link";

import { Box, Button, Stack } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import { formatDate } from "@/lib/utils/date";

import type { MeetingDetails } from "../types";

import MeetingActionButton from "./MeetingActionButton";
import { MeetingDataRefreshProvider, useMeetingDataRefresh } from "./MeetingDataRefresh";
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
import MeetingTabs, { MEETING_TAB_SLUGS, resolveMeetingTabIndex } from "./MeetingTabs";

const SUMMARY_TAB_INDEX = MEETING_TAB_SLUGS.indexOf("summary");
const MEMBERS_TAB_INDEX = MEETING_TAB_SLUGS.indexOf("members");

type Props = {
  meeting: MeetingDetails;
  initialTab?: string | null;
};

export default function MeetingWorkspace({ meeting, initialTab }: Props) {
  return (
    <MeetingDataRefreshProvider>
      <MeetingWorkspaceContent meeting={meeting} initialTab={initialTab} />
    </MeetingDataRefreshProvider>
  );
}

function MeetingWorkspaceContent({ meeting, initialTab }: Props) {
  const { refreshKey, refreshMeetingData } = useMeetingDataRefresh();
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

    if (value === SUMMARY_TAB_INDEX || value === MEMBERS_TAB_INDEX) {
      refreshMeetingData();
    }
  }

  const panelSx = useMemo(
    () => (index: number) => ({
      display: tab === index ? "block" : "none",
    }),
    [tab],
  );

  const readOnly = !meeting.canEdit;

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Meeting"
        subtitle={formatDate(meeting.meetingDate)}
        subtitleVariant="body1"
        backHref="/meetings"
      >
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Link href={`/meetings/${meeting.id}/edit`} style={{ textDecoration: "none" }}>
            <Button variant="outlined" disabled={readOnly}>
              Edit
            </Button>
          </Link>

          <MeetingActionButton
            meetingId={meeting.id}
            action="start"
            label="Start Meeting"
            color="success"
            disabled={meeting.status !== "DRAFT" || readOnly}
          />

          <MeetingActionButton
            meetingId={meeting.id}
            action="delete"
            label="Delete Meeting"
            color="error"
            variant="outlined"
            confirm
            disabled={!meeting.canDelete}
          />

          {meeting.canReopen && (
            <MeetingActionButton
              meetingId={meeting.id}
              action="reopen"
              label="Reopen Meeting"
              color="warning"
              variant="outlined"
              confirm
            />
          )}

          <MeetingActionButton
            meetingId={meeting.id}
            action="close"
            label="Close Meeting"
            color="warning"
            disabled={meeting.status !== "IN_PROGRESS" || readOnly}
          />
        </Stack>
      </PageHeader>

      <MeetingTabs value={tab} status={meeting.status} onChange={handleTabChange} />

      <Box sx={panelSx(0)}>
        <MeetingGeneralPanel meeting={meeting} />
      </Box>

      {visitedTabs.has(1) && (
        <Box sx={panelSx(1)}>
          <AttendanceTabPanel meetingId={meeting.id} readOnly={readOnly} />
        </Box>
      )}

      {visitedTabs.has(2) && (
        <Box sx={panelSx(2)}>
          <PaymentsTabPanel meetingId={meeting.id} readOnly={readOnly} />
        </Box>
      )}

      {visitedTabs.has(3) && (
        <Box sx={panelSx(3)}>
          <LoansTabPanel meetingId={meeting.id} readOnly={readOnly} />
        </Box>
      )}

      {visitedTabs.has(4) && (
        <Box sx={panelSx(4)}>
          <BankTabPanel meetingId={meeting.id} readOnly={readOnly} />
        </Box>
      )}

      {visitedTabs.has(5) && (
        <Box sx={panelSx(5)}>
          <IncomeTabPanel meetingId={meeting.id} readOnly={readOnly} />
        </Box>
      )}

      {visitedTabs.has(6) && (
        <Box sx={panelSx(6)}>
          <ExpensesTabPanel meetingId={meeting.id} readOnly={readOnly} />
        </Box>
      )}

      {visitedTabs.has(7) && (
        <Box sx={panelSx(7)}>
          <MembersTabPanel meetingId={meeting.id} refreshKey={refreshKey} />
        </Box>
      )}

      {visitedTabs.has(8) && (
        <Box sx={panelSx(8)}>
          <SummaryTabPanel meetingId={meeting.id} refreshKey={refreshKey} readOnly={readOnly} />
        </Box>
      )}
    </Stack>
  );
}
