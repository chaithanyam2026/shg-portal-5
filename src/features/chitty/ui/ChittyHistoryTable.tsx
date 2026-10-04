"use client";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { formatCurrency, formatDate } from "@/lib/utils/format";

import type { ChittyHistoryRow } from "../types";

type Props = {
  rows: ChittyHistoryRow[];
};

export default function ChittyHistoryTable({ rows }: Props) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Sunday</TableCell>
            <TableCell align="right">Collected</TableCell>
            <TableCell align="right">Previous pending</TableCell>
            <TableCell align="right">Collection</TableCell>
            <TableCell align="right">Disbursed</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No Sundays yet.
              </TableCell>
            </TableRow>
          )}
          {rows.map((row) => (
            <TableRow key={row.date}>
              <TableCell>{formatDate(row.date)}</TableCell>
              <TableCell align="right">{formatCurrency(row.collected)}</TableCell>
              <TableCell align="right">{formatCurrency(row.previousPending)}</TableCell>
              <TableCell align="right">{formatCurrency(row.collection)}</TableCell>
              <TableCell align="right">{formatCurrency(row.disbursedAmount)}</TableCell>
              <TableCell align="right">{formatCurrency(row.balance)}</TableCell>
              <TableCell>{row.closed ? "Closed" : "Open"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
