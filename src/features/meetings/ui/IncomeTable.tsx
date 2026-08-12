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

import { INCOME_CATEGORY } from "../domain/income";

import type { IncomeRecord } from "../types";

import IncomeRow from "./IncomeRow";

type Props = {
  records: IncomeRecord[];
  disabled?: boolean;
  onChange(records: IncomeRecord[]): void;
};

export default function IncomeTable({ records, disabled = false, onChange }: Props) {
  function updateRecord(index: number, value: IncomeRecord) {
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
        transactionDate: new Date().toISOString().slice(0, 10),
        category: INCOME_CATEGORY.MISCELLANEOUS,
        amount: 0,
        remarks: "",
      },
    ]);
  }

  return (
    <Stack spacing={2}>
      <Button variant="outlined" disabled={disabled} onClick={addRecord}>
        Add Income
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
                  No income records.
                </TableCell>
              </TableRow>
            )}

            {records.map((record, index) => (
              <IncomeRow
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
