"use client";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";

import { formatCurrency } from "@/lib/utils/format";

import type { ChittyAgentSummary } from "../types";

type Props = {
  summaries: ChittyAgentSummary[];
};

export default function ChittySummaryTable({ summaries }: Props) {
  const totals = summaries.reduce(
    (acc, summary) => ({
      cash: acc.cash + summary.cash,
      gpay: acc.gpay + summary.gpay,
      total: acc.total + summary.total,
    }),
    { cash: 0, gpay: 0, total: 0 },
  );

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>SHG member</TableCell>
            <TableCell align="right">Total cash collected</TableCell>
            <TableCell align="right">Total GPay collected</TableCell>
            <TableCell align="right">Total collection</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summaries.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No payments to summarise.
              </TableCell>
            </TableRow>
          )}
          {summaries.map((summary) => (
            <TableRow key={summary.agentMemberId}>
              <TableCell>{summary.agentMemberName}</TableCell>
              <TableCell align="right">{formatCurrency(summary.cash)}</TableCell>
              <TableCell align="right">{formatCurrency(summary.gpay)}</TableCell>
              <TableCell align="right">{formatCurrency(summary.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {summaries.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell>All members</TableCell>
              <TableCell align="right">{formatCurrency(totals.cash)}</TableCell>
              <TableCell align="right">{formatCurrency(totals.gpay)}</TableCell>
              <TableCell align="right">{formatCurrency(totals.total)}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
}
