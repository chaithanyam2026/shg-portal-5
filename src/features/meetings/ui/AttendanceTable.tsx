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

import type {
  AttendanceRecord,
} from "../types";

import AttendanceRow from "./AttendanceRow";

type Props = {
  records: AttendanceRecord[];

  disabled?: boolean;

  onChange(
    records: AttendanceRecord[],
  ): void;
};

export default function AttendanceTable({
  records,
  disabled = false,
  onChange,
}: Props) {
  function updateRecord(
    index: number,
    value: AttendanceRecord,
  ) {
    const next = [...records];

    next[index] = value;

    onChange(next);
  }

  return (
    <TableContainer
      component={Paper}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={100}>
              Code
            </TableCell>

            <TableCell>
              Member
            </TableCell>

            <TableCell width={180}>
              Attendance
            </TableCell>

            <TableCell>
              Remarks
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                align="center"
              >
                No members found.
              </TableCell>
            </TableRow>
          )}

          {records.map(
            (record, index) => (
              <AttendanceRow
                key={record.memberId}
                record={record}
                disabled={disabled}
                onChange={(value) =>
                  updateRecord(
                    index,
                    value,
                  )
                }
              />
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}