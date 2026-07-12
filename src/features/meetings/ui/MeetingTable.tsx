"use client";

import Link from "next/link";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import type { MeetingSummary } from "../types";

import MeetingStatusChip from "./MeetingStatusChip";
import { formatDate } from "@/lib/utils/date";

type Props = {
  meetings: MeetingSummary[];
};

// function formatDate(value: string) {
//   return new Date(value).toLocaleDateString();
// }

export default function MeetingTable({
  meetings,
}: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Meeting Date</TableCell>

            <TableCell>Place</TableCell>

            <TableCell>Status</TableCell>

            <TableCell>Created</TableCell>

            <TableCell align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {meetings.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
              >
                No meetings found.
              </TableCell>
            </TableRow>
          )}

          {meetings.map((meeting) => (
            <TableRow
              key={meeting.id}
              hover
            >
              <TableCell>
                {formatDate(
                  meeting.meetingDate,
                )}
              </TableCell>

              <TableCell>
                {meeting.place}
              </TableCell>

              <TableCell>
                <MeetingStatusChip
                  status={meeting.status}
                />
              </TableCell>

              <TableCell>
                {formatDate(
                  meeting.createdAt,
                )}
              </TableCell>

              <TableCell align="right">
                <Button
                  component={Link}
                  href={`/meetings/${meeting.id}`}
                  size="small"
                >
                  View
                </Button>

                <Button
                  component={Link}
                  href={`/meetings/${meeting.id}/edit`}
                  size="small"
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}