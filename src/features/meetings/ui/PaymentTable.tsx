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

  const showSpecialLoan = records.some(
    (record) => record.hasSpecialLoan || record.specialLoanFine > 0,
  );
  const columnCount = showSpecialLoan ? 8 : 7;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={80} align="right">
              Si. No.
            </TableCell>
            <TableCell>Member<br />(പേര്) </TableCell>
            <TableCell>Contribution<br />(സമ്പാദ്യം)</TableCell>
            <TableCell>Loan Repayment<br />(ലോൺ)</TableCell>
            <TableCell>Absent Fine<br />(ഫൈൻ)</TableCell>
            {showSpecialLoan && <TableCell>Special Loan</TableCell>}
            <TableCell>Total</TableCell>
            <TableCell>Remarks</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={columnCount} align="center">
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
              showSpecialLoan={showSpecialLoan}
              onChange={(value) => updateRecord(index, value)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
