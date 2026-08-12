"use client";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { AttendanceFineCollectionReport } from "../domain/attendance-fine-collection";

type Props = {
  report: AttendanceFineCollectionReport;
};

function formatCurrency(value: number) {
  return `₹ ${value.toLocaleString("en-IN")}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN");
}

export default function AttendanceFineCollectionTable({ report }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Meeting Date</TableCell>

            <TableCell align="center">Present</TableCell>

            <TableCell align="center">Absent</TableCell>

            <TableCell align="center">Leave</TableCell>

            <TableCell align="right">Generated</TableCell>

            <TableCell align="right">Collected</TableCell>

            <TableCell align="right">Pending</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {report.rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography color="text.secondary">
                  No attendance fine collection available.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            report.rows.map((row) => (
              <TableRow key={row.meetingId} hover>
                <TableCell>{formatDate(row.meetingDate)}</TableCell>

                <TableCell align="center">{row.presentCount}</TableCell>

                <TableCell align="center">{row.absentCount}</TableCell>

                <TableCell align="center">{row.leaveCount}</TableCell>

                <TableCell align="right">{formatCurrency(row.generatedFine)}</TableCell>

                <TableCell align="right">{formatCurrency(row.collectedFine)}</TableCell>

                <TableCell
                  align="right"
                  sx={{
                    color: row.pendingFine > 0 ? "error.main" : "success.main",
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(row.pendingFine)}
                </TableCell>
              </TableRow>
            ))
          )}

          <TableRow>
            <TableCell colSpan={4}>
              <Typography sx={{ fontWeight: 600 }}>Totals</Typography>
            </TableCell>

            <TableCell align="right">
              <Typography sx={{ fontWeight: 600 }}>
                {formatCurrency(report.totals.generatedFine)}
              </Typography>
            </TableCell>

            <TableCell align="right">
              <Typography sx={{ fontWeight: 600 }}>
                {formatCurrency(report.totals.collectedFine)}
              </Typography>
            </TableCell>

            <TableCell
              align="right"
              sx={{
                color: report.totals.pendingFine > 0 ? "error.main" : "success.main",
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {formatCurrency(report.totals.pendingFine)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
