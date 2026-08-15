"use client";

import {
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { ATTENDANCE_STATUS } from "../domain/attendance-status";
import type { AttendanceRecord } from "../types";

import AttendanceRow from "./AttendanceRow";

type Props = {
  records: AttendanceRecord[];

  disabled?: boolean;

  onChange(records: AttendanceRecord[]): void;
};

export default function AttendanceTable({ records, disabled = false, onChange }: Props) {
  const hasRecords = records.length > 0;
  const allPresent =
    hasRecords && records.every((record) => record.status === ATTENDANCE_STATUS.PRESENT);
  const allAbsent =
    hasRecords && records.every((record) => record.status === ATTENDANCE_STATUS.ABSENT);

  function updateRecord(index: number, value: AttendanceRecord) {
    const next = [...records];

    next[index] = value;

    onChange(next);
  }

  function setAllStatus(status: typeof ATTENDANCE_STATUS.PRESENT | typeof ATTENDANCE_STATUS.ABSENT) {
    onChange(
      records.map((record) => ({
        ...record,
        status,
      })),
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={allPresent}
              disabled={disabled || !hasRecords}
              onChange={(_, checked) => {
                if (checked) {
                  setAllStatus(ATTENDANCE_STATUS.PRESENT);
                }
              }}
            />
          }
          label="Make all present"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={allAbsent}
              disabled={disabled || !hasRecords}
              onChange={(_, checked) => {
                if (checked) {
                  setAllStatus(ATTENDANCE_STATUS.ABSENT);
                }
              }}
            />
          }
          label="Make all absent"
        />
      </Stack>

      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={80} align="right">
              Si. No.
            </TableCell>

            <TableCell>Member</TableCell>

            <TableCell width={180}>Attendance</TableCell>

            <TableCell>Remarks</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No members found.
              </TableCell>
            </TableRow>
          )}

          {records.map((record, index) => (
            <AttendanceRow
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
    </Stack>
  );
}
