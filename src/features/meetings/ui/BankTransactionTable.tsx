"use client";

import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { BANK_TRANSACTION_TYPE } from "../domain/bank-transaction";

import type { BankTransactionRecord } from "../types";

import BankTransactionRow from "./BankTransactionRow";

type Props = {
  records: BankTransactionRecord[];
  disabled?: boolean;
  onChange(records: BankTransactionRecord[]): void;
};

export default function BankTransactionTable({ records, disabled = false, onChange }: Props) {
  function updateRecord(index: number, value: BankTransactionRecord) {
    const next = [...records];
    next[index] = value;
    onChange(next);
  }

  function deleteRecord(index: number) {
    const next = records.filter((_, i) => i !== index);

    onChange(next);
  }

  function addRecord() {
    onChange([
      ...records,
      {
        transactionDate: new Date().toISOString().slice(0, 10),
        type: BANK_TRANSACTION_TYPE.DEPOSIT,
        amount: 0,
        remarks: "",
      },
    ]);
  }

  return (
    <Stack spacing={2}>
      <Button variant="outlined" disabled={disabled} onClick={addRecord}>
        Add Transaction
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No transactions.
                </TableCell>
              </TableRow>
            )}

            {records.map((record, index) => (
              <BankTransactionRow
                key={index}
                record={record}
                disabled={disabled}
                onDelete={() => deleteRecord(index)}
                onChange={(value) => updateRecord(index, value)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
