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

import type {
  AttendanceRegister,
} from "../domain";

import AttendanceStatusChip from "./AttendanceStatusChip";

type Props = {
  register: AttendanceRegister;
};

export default function AttendanceRegisterTable({
  register,
}: Props) {
  return (
    <TableContainer
      component={Paper}
    >
      <Table
        stickyHeader
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell>
              Code
            </TableCell>

            <TableCell>
              Member
            </TableCell>

            {register.meetings.map(
              (meeting) => (
                <TableCell
                  key={
                    meeting.meetingId
                  }
                  align="center"
                >
                  <Typography
                    variant="caption"
                  >
                    {meeting.meetingDate.toLocaleDateString(
                      "en-IN",
                    )}
                  </Typography>
                </TableCell>
              ),
            )}

            <TableCell align="right">
              Total
            </TableCell>

            <TableCell align="right">
              Paid
            </TableCell>

            <TableCell align="right">
              Balance
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {register.rows.map(
            (row) => (
              <TableRow
                key={
                  row.memberId
                }
              >
                <TableCell>
                  {
                    row.memberCode
                  }
                </TableCell>

                <TableCell>
                  {
                    row.memberName
                  }
                </TableCell>

                {row.attendance.map(
                  (cell) => (
                    <TableCell
                      key={
                        cell.meetingId
                      }
                      align="center"
                    >
                      <AttendanceStatusChip
                        cell={
                          cell
                        }
                      />
                    </TableCell>
                  ),
                )}

                <TableCell align="right">
                  ₹
                  {row.totalFine.toLocaleString(
                    "en-IN",
                  )}
                </TableCell>

                <TableCell align="right">
                  ₹
                  {row.paidFine.toLocaleString(
                    "en-IN",
                  )}
                </TableCell>

                <TableCell align="right">
                  ₹
                  {row.pendingFine.toLocaleString(
                    "en-IN",
                  )}
                </TableCell>
              </TableRow>
            ),
          )}

          {/* Footer */}

          <TableRow>
            <TableCell
              colSpan={2}
            >
              <strong>
                Summary
              </strong>
            </TableCell>

            {register.summary.map(
              (
                summary,
              ) => (
                <TableCell
                  key={
                    summary.meetingId
                  }
                  align="center"
                >
                  <Typography variant="caption">
                    P:
                    {
                      summary.presentCount
                    }
                    <br />
                    A:
                    {
                      summary.absentCount
                    }
                    <br />
                    L:
                    {
                      summary.leaveCount
                    }
                    <br />
                    ₹
                    {
                      summary.fineGenerated
                    }
                  </Typography>
                </TableCell>
              ),
            )}

            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}