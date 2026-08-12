"use client";

import type { ReactNode } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import {
  Box,
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

import type { AttendanceRegister } from "../domain";

import AttendanceStatusIcon from "./AttendanceStatusIcon";

type Props = {
  register: AttendanceRegister;
};

function formatMeetingDate(value: Date) {
  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function LegendItem({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
      {icon}
      <Typography variant="caption">{label}</Typography>
    </Stack>
  );
}

export default function AttendanceRegisterTable({ register }: Props) {
  if (register.meetings.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary" align="center">
          No closed meetings found for this financial year.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <LegendItem
          icon={<CheckCircleIcon color="success" fontSize="small" />}
          label="Present"
        />

        <LegendItem
          icon={<CancelOutlinedIcon color="error" fontSize="small" />}
          label="Absent"
        />

        <LegendItem
          icon={<EventBusyOutlinedIcon color="warning" fontSize="small" />}
          label="Leave"
        />
      </Stack>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          maxHeight: 560,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                  bgcolor: "background.paper",
                  minWidth: 72,
                }}
              >
                Code
              </TableCell>

              <TableCell
                sx={{
                  position: "sticky",
                  left: 72,
                  zIndex: 3,
                  bgcolor: "background.paper",
                  minWidth: 140,
                  boxShadow: (theme) => `4px 0 4px -4px ${theme.palette.divider}`,
                }}
              >
                Member
              </TableCell>

              {register.meetings.map((meeting) => (
                <TableCell key={meeting.meetingId} align="center" sx={{ minWidth: 56 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {formatMeetingDate(meeting.meetingDate)}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {register.rows.map((row) => (
              <TableRow key={row.memberId} hover>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    bgcolor: "background.paper",
                  }}
                >
                  {row.memberCode}
                </TableCell>

                <TableCell
                  sx={{
                    position: "sticky",
                    left: 72,
                    zIndex: 1,
                    bgcolor: "background.paper",
                    boxShadow: (theme) => `4px 0 4px -4px ${theme.palette.divider}`,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: 140,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.memberName}
                  </Box>
                </TableCell>

                {row.attendance.map((cell) => (
                  <TableCell key={cell.meetingId} align="center" sx={{ px: 0.5 }}>
                    <AttendanceStatusIcon cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}

            <TableRow>
              <TableCell
                colSpan={2}
                sx={{
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  bgcolor: "background.paper",
                  fontWeight: 700,
                }}
              >
                Meeting summary
              </TableCell>

              {register.summary.map((summary) => (
                <TableCell key={summary.meetingId} align="center">
                  <Stack spacing={0.25}>
                    <Typography variant="caption" color="success.main">
                      P: {summary.presentCount}
                    </Typography>

                    <Typography variant="caption" color="error.main">
                      A: {summary.absentCount}
                    </Typography>

                    <Typography variant="caption" color="warning.main">
                      L: {summary.leaveCount}
                    </Typography>
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
