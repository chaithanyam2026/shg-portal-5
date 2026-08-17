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

import { EXPENSE_CATEGORY } from "../domain/expense";

import type { ExpenseRecord } from "../types";
import { toDateInputValue } from "@/lib/utils/date";

import ExpenseRow from "./ExpenseRow";

type Props = {
  records: ExpenseRecord[];
  disabled?: boolean;
  onChange(records: ExpenseRecord[]): void;
};

export default function ExpenseTable({ records, disabled = false, onChange }: Props) {
  function updateRecord(index: number, value: ExpenseRecord) {
    const next = [...records];
    next[index] = value;
    onChange(next);
  }

  function deleteRecord(index: number) {
    onChange(records.filter((_, i) => i !== index));
  }

  function addRecord() {
    onChange([
      ...records,
      {
        transactionDate: toDateInputValue(),
        category: EXPENSE_CATEGORY.MISCELLANEOUS,
        amount: 0,
        remarks: "",
      },
    ]);
  }

  return (
    <Stack spacing={2}>
      <Button variant="outlined" disabled={disabled} onClick={addRecord}>
        Add Expense
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No expense records.
                </TableCell>
              </TableRow>
            )}

            {records.map((record, index) => (
              <ExpenseRow
                key={index}
                record={record}
                disabled={disabled}
                onChange={(value) => updateRecord(index, value)}
                onDelete={() => deleteRecord(index)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
