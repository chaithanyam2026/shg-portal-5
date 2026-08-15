"use client";

import { MenuItem, TableCell, TableRow, TextField } from "@mui/material";

import { ATTENDANCE_STATUS_OPTIONS } from "../domain/attendance-status";

import type { AttendanceRecord } from "../types";

type Props = {
  serialNumber: number;

  record: AttendanceRecord;

  disabled?: boolean;

  onChange(value: AttendanceRecord): void;
};

export default function AttendanceRow({
  serialNumber,
  record,
  disabled = false,
  onChange,
}: Props) {
  return (
    <TableRow hover>
      <TableCell align="right">{serialNumber}</TableCell>

      <TableCell>{record.memberName}</TableCell>

      <TableCell width={180}>
        <TextField
          select
          fullWidth
          size="small"
          disabled={disabled}
          value={record.status}
          onChange={(event) =>
            onChange({
              ...record,
              status: event.target.value as typeof record.status,
            })
          }
        >
          {ATTENDANCE_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          disabled={disabled}
          value={record.remarks}
          onChange={(event) =>
            onChange({
              ...record,
              remarks: event.target.value,
            })
          }
        />
      </TableCell>
    </TableRow>
  );
}
