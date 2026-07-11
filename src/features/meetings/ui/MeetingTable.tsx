/* "use client";

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import type { MeetingSummary } from "../types";

import MeetingStatusChip from "./MeetingStatusChip";

type Props = {
  meetings: MeetingSummary[];

  onView?(id: string): void;

  onEdit?(id: string): void;
};

export default function MeetingTable({
  meetings,
  onView,
  onEdit,
}: Props) {
  return (
    <Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              Meeting Date
            </TableCell>

            <TableCell>
              Place
            </TableCell>

            <TableCell>
              Status
            </TableCell>

            <TableCell>
              Created
            </TableCell>

            <TableCell
              align="right"
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {meetings.map((meeting) => (
            <TableRow
              key={meeting.id}
              hover
            >
              <TableCell>
                {new Date(meeting.meetingDate).toLocaleDateString()}
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
                {new Date(meeting.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell
                align="right"
              >
                <IconButton
                  onClick={() =>
                    onView?.(
                      meeting.id,
                    )
                  }
                >
                  <VisibilityIcon />
                </IconButton>

                <IconButton
                  onClick={() =>
                    onEdit?.(
                      meeting.id,
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

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
        </TableBody>
      </Table>
    </Paper>
  );
} */
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

type Props = {
  meetings: MeetingSummary[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

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