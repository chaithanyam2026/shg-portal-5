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

import { formatCurrency, formatDate } from "@/lib/utils/format";

import type { ChittyPaymentRecord } from "../types";

type Props = {
  date: string;
  records: ChittyPaymentRecord[];
};

export default function ChittyAuctionTable({ date, records }: Props) {
  const rows = records
    .filter((record) => record.auctionAmount > 0)
    .sort(
      (left, right) =>
        left.auctionAmount - right.auctionAmount || left.userName.localeCompare(right.userName),
    );

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Auction amounts for {formatDate(date)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell width={72}>Order</TableCell>
            <TableCell>Chitty user</TableCell>
            <TableCell>SHG member</TableCell>
            <TableCell align="right">Auction amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No auction amounts for this Sunday.
              </TableCell>
            </TableRow>
          )}
          {rows.map((record, index) => (
            <TableRow key={record.chittyUserId}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{record.userName}</TableCell>
              <TableCell>{record.agentMemberName}</TableCell>
              <TableCell align="right">{formatCurrency(record.auctionAmount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
