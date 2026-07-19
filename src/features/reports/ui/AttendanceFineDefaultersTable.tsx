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

import type { AttendanceFineDefaultersReport } from "../domain/attendance-fine-defaulters";

type Props = {
  report: AttendanceFineDefaultersReport;
};

function formatCurrency(value: number) {
  return `₹ ${value.toLocaleString("en-IN")}`;
}

function formatPercentage(value: number) {
  return `${value.toFixed(2)}%`;
}

function formatDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("en-IN");
}

export default function AttendanceFineDefaultersTable({ report }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>

            <TableCell>Member</TableCell>

            <TableCell align="center">Present</TableCell>

            <TableCell align="center">Absent</TableCell>

            <TableCell align="center">Leave</TableCell>

            <TableCell align="right">Attendance %</TableCell>

            <TableCell align="right">Generated</TableCell>

            <TableCell align="right">Paid</TableCell>

            <TableCell align="right">Pending</TableCell>

            <TableCell>Oldest Pending</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {report.rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center">
                <Typography color="text.secondary">No attendance fine defaulters.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            report.rows.map((row) => (
              <TableRow key={row.memberId} hover>
                <TableCell>{row.memberCode}</TableCell>

                <TableCell>{row.memberName}</TableCell>

                <TableCell align="center">{row.presentCount}</TableCell>

                <TableCell align="center">{row.absentCount}</TableCell>

                <TableCell align="center">{row.leaveCount}</TableCell>

                <TableCell align="right">{formatPercentage(row.attendancePercentage)}</TableCell>

                <TableCell align="right">{formatCurrency(row.totalFine)}</TableCell>

                <TableCell align="right">{formatCurrency(row.paidFine)}</TableCell>

                <TableCell
                  align="right"
                  sx={{
                    color: row.pendingFine > 0 ? "error.main" : "success.main",
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(row.pendingFine)}
                </TableCell>

                <TableCell>{formatDate(row.oldestPendingDate)}</TableCell>
              </TableRow>
            ))
          )}

          <TableRow>
            <TableCell colSpan={6}>
              <Typography fontWeight={600}>Total ({report.totals.members} Members)</Typography>
            </TableCell>

            <TableCell align="right">
              <Typography fontWeight={600}>{formatCurrency(report.totals.totalFine)}</Typography>
            </TableCell>

            <TableCell align="right">
              <Typography fontWeight={600}>{formatCurrency(report.totals.paidFine)}</Typography>
            </TableCell>

            <TableCell
              align="right"
              sx={{
                color: report.totals.pendingFine > 0 ? "error.main" : "success.main",
              }}
            >
              <Typography fontWeight={600}>{formatCurrency(report.totals.pendingFine)}</Typography>
            </TableCell>

            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
