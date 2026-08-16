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

import type { PaymentRecord } from "../types";

import PaymentRow from "./PaymentRow";

type Props = {
  records: PaymentRecord[];
  disabled?: boolean;
  onChange(records: PaymentRecord[]): void;
};

export default function PaymentTable({ records, disabled = false, onChange }: Props) {
  function updateRecord(index: number, record: PaymentRecord) {
    const next = [...records];
    next[index] = record;
    onChange(next);
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={80} align="right">
              Si. No.
            </TableCell>
            <TableCell>Member</TableCell>
            <TableCell>Contribution</TableCell>
            <TableCell>Loan Repayment</TableCell>
            <TableCell>Absent Fine</TableCell>
            <TableCell>Special Loan</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Remarks</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No members found.
              </TableCell>
            </TableRow>
          )}

          {records.map((record, index) => (
            <PaymentRow
              key={record.memberId}
              serialNumber={index + 1}
              record={record}
              disabled={disabled}
              onChange={(value) => updateRecord(index, value)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
