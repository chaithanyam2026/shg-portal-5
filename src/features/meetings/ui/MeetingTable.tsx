"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { MeetingSummary } from "../types";

import { formatDate } from "@/lib/utils/date";

import MeetingStatusChip from "./MeetingStatusChip";

type Props = {
  meetings: MeetingSummary[];
};

type MonthGroup = {
  key: string;
  meetings: MeetingSummary[];
};

function getMonthKey(value: string) {
  const date = new Date(value);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getCurrentMonthKey() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);

  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function groupMeetingsByMonth(meetings: MeetingSummary[]): MonthGroup[] {
  const groups = new Map<string, MeetingSummary[]>();

  for (const meeting of meetings) {
    const key = getMonthKey(meeting.meetingDate);
    const existing = groups.get(key) ?? [];

    existing.push(meeting);
    groups.set(key, existing);
  }

  return [...groups.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([key, monthMeetings]) => ({
      key,
      meetings: monthMeetings.sort(
        (left, right) => new Date(right.meetingDate).getTime() - new Date(left.meetingDate).getTime(),
      ),
    }));
}

function MeetingRows({ meetings }: { meetings: MeetingSummary[] }) {
  return (
    <>
      {meetings.map((meeting) => (
        <TableRow key={meeting.id} hover>
          <TableCell>{formatDate(meeting.meetingDate)}</TableCell>

          <TableCell>{meeting.place}</TableCell>

          <TableCell>
            <MeetingStatusChip status={meeting.status} />
          </TableCell>

          <TableCell>{formatDate(meeting.createdAt)}</TableCell>

          <TableCell align="right">
            <Button component={Link} href={`/meetings/${meeting.id}`} size="small">
              View
            </Button>

            <Button component={Link} href={`/meetings/${meeting.id}/edit`} size="small">
              Edit
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function MeetingTable({ meetings }: Props) {
  const currentMonthKey = useMemo(() => getCurrentMonthKey(), []);
  const monthGroups = useMemo(() => groupMeetingsByMonth(meetings), [meetings]);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(
    () => new Set([currentMonthKey]),
  );

  useEffect(() => {
    setExpandedMonths(new Set([currentMonthKey]));
  }, [meetings, currentMonthKey]);

  function toggleMonth(monthKey: string) {
    setExpandedMonths((previous) => {
      const next = new Set(previous);

      if (next.has(monthKey)) {
        next.delete(monthKey);
      } else {
        next.add(monthKey);
      }

      return next;
    });
  }

  if (meetings.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography align="center" color="text.secondary">
          No meetings found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={1}>
      {monthGroups.map((group) => {
        const expanded = expandedMonths.has(group.key);

        return (
          <Accordion
            key={group.key}
            expanded={expanded}
            onChange={() => toggleMonth(group.key)}
            disableGutters
            elevation={1}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", width: "100%", pr: 1 }}
              >
                <Typography sx={{ fontWeight: 600 }}>{formatMonthLabel(group.key)}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {group.meetings.length} meeting{group.meetings.length === 1 ? "" : "s"}
                </Typography>
              </Stack>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Meeting Date</TableCell>

                      <TableCell>Place</TableCell>

                      <TableCell>Status</TableCell>

                      <TableCell>Created</TableCell>

                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <MeetingRows meetings={group.meetings} />
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
