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
  AttendanceFineRegister,
} from "../domain/attendance-fine-register";

type Props = {
  register: AttendanceFineRegister;
};

function formatCurrency(
  value: number,
) {
  return `₹ ${value.toLocaleString(
    "en-IN",
  )}`;
}

function formatPercentage(
  value: number,
) {
  return `${value.toFixed(2)}%`;
}

export default function AttendanceFineRegisterTable({
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

            <TableCell align="center">
              Present
            </TableCell>

            <TableCell align="center">
              Absent
            </TableCell>

            <TableCell align="center">
              Leave
            </TableCell>

            <TableCell align="right">
              Attendance %
            </TableCell>

            <TableCell align="right">
              Generated
            </TableCell>

            <TableCell align="right">
              Paid
            </TableCell>

            <TableCell align="right">
              Pending
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {register.rows.length ===
          0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                align="center"
              >
                <Typography
                  color="text.secondary"
                >
                  No attendance
                  fine records found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            register.rows.map(
              (row) => (
                <TableRow
                  key={
                    row.memberId
                  }
                  hover
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

                  <TableCell align="center">
                    {
                      row.presentCount
                    }
                  </TableCell>

                  <TableCell align="center">
                    {
                      row.absentCount
                    }
                  </TableCell>

                  <TableCell align="center">
                    {
                      row.leaveCount
                    }
                  </TableCell>

                  <TableCell align="right">
                    {formatPercentage(
                      row.attendancePercentage,
                    )}
                  </TableCell>

                  <TableCell align="right">
                    {formatCurrency(
                      row.totalFine,
                    )}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color:
                        "success.main",
                    }}
                  >
                    {formatCurrency(
                      row.paidFine,
                    )}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color:
                        row.pendingFine >
                        0
                          ? "error.main"
                          : "success.main",
                      fontWeight: 600,
                    }}
                  >
                    {formatCurrency(
                      row.pendingFine,
                    )}
                  </TableCell>
                </TableRow>
              ),
            )
          )}

          <TableRow>
            <TableCell
              colSpan={6}
            >
              <Typography
                fontWeight={700}
              >
                Totals
              </Typography>
            </TableCell>

            <TableCell
              align="right"
            >
              <Typography
                fontWeight={700}
              >
                {formatCurrency(
                  register.totals
                    .totalFine,
                )}
              </Typography>
            </TableCell>

            <TableCell
              align="right"
            >
              <Typography
                fontWeight={700}
                color="success.main"
              >
                {formatCurrency(
                  register.totals
                    .paidFine,
                )}
              </Typography>
            </TableCell>

            <TableCell
              align="right"
            >
              <Typography
                fontWeight={700}
                color={
                  register.totals
                    .pendingFine >
                  0
                    ? "error.main"
                    : "success.main"
                }
              >
                {formatCurrency(
                  register.totals
                    .pendingFine,
                )}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}