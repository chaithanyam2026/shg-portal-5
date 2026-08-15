"use client";

import {
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

import { formatDate } from "@/lib/utils/date";

import type { MeetingIncomeExpenseSummary } from "../domain/meeting-income-expense-summary";

type Props = {
  summary: MeetingIncomeExpenseSummary;
};

function formatCurrency(value: number) {
  return `₹ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function FinancialYearEndMeetingIncomeExpenseTable({ summary }: Props) {
  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography variant="h6">Meeting Income &amp; Expense</Typography>

        <Typography variant="body2" color="text.secondary">
          Closed meetings with other income or expense records. Totals are shown per meeting date.
        </Typography>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 140 }}>Meeting Date</TableCell>

              <TableCell align="right" sx={{ minWidth: 140 }}>
                Income
              </TableCell>

              <TableCell align="right" sx={{ minWidth: 140 }}>
                Expense
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {summary.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="text.secondary">
                    No meetings with income or expense records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              summary.rows.map((row) => (
                <TableRow key={row.meetingId} hover>
                  <TableCell>{formatDate(row.meetingDate)}</TableCell>

                  <TableCell align="right">
                    {row.income > 0 ? formatCurrency(row.income) : "-"}
                  </TableCell>

                  <TableCell align="right">
                    {row.expense > 0 ? formatCurrency(row.expense) : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}

            {summary.rows.length > 0 && (
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontWeight: 700 }}>Totals</Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(summary.totals.income)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(summary.totals.expense)}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
