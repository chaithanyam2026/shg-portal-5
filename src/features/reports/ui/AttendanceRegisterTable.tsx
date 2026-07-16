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

import {
  ATTENDANCE_STATUS,
} from "@/features/meetings/domain/attendance-status";

import {
  formatDate,
} from "@/lib/utils/format";

type Props = {
  register: AttendanceRegister;
};

function getSymbol(
  status: string,
) {
  switch (status) {
    case ATTENDANCE_STATUS.PRESENT:
      return "✓";

    case ATTENDANCE_STATUS.LEAVE:
      return "L";

    default:
      return "A";
  }
}

export default function AttendanceRegisterTable({
  register,
}: Props) {
  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
      >
        Attendance Register
      </Typography>

      <Typography
        color="text.secondary"
        mb={2}
      >
        {register.financialYearName}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          maxHeight: "75vh",
        }}
      >
        <Table
          stickyHeader
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: "sticky",
                  left: 0,
                  backgroundColor:
                    "background.paper",
                  zIndex: 3,
                  minWidth: 60,
                }}
              >
                Code
              </TableCell>

              <TableCell
                sx={{
                  position: "sticky",
                  left: 60,
                  backgroundColor:
                    "background.paper",
                  zIndex: 3,
                  minWidth: 220,
                }}
              >
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
                    {formatDate(
                      meeting.meetingDate,
                    )}
                  </TableCell>
                ),
              )}

              <TableCell align="center">
                P
              </TableCell>

              <TableCell align="center">
                A
              </TableCell>

              <TableCell align="center">
                L
              </TableCell>

              <TableCell align="center">
                %
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
                  <TableCell
                    sx={{
                      position:
                        "sticky",
                      left: 0,
                      backgroundColor:
                        "background.paper",
                    }}
                  >
                    {
                      row.memberCode
                    }
                  </TableCell>

                  <TableCell
                    sx={{
                      position:
                        "sticky",
                      left: 60,
                      backgroundColor:
                        "background.paper",
                    }}
                  >
                    {
                      row.memberName
                    }
                  </TableCell>

                  {row.attendance.map(
                    (
                      cell,
                      index,
                    ) => (
                      <TableCell
                        key={
                          index
                        }
                        align="center"
                      >
                        {getSymbol(
                          cell.status,
                        )}
                      </TableCell>
                    ),
                  )}

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

                  <TableCell align="center">
                    {
                      row.attendancePercentage
                    }
                    %
                  </TableCell>
                </TableRow>
              ),
            )}

            <TableRow>
              <TableCell
                colSpan={2}
                sx={{
                  fontWeight: 700,
                }}
              >
                Meeting Summary
              </TableCell>

              {register.meetingSummary.map(
                (
                  summary,
                ) => (
                  <TableCell
                    key={
                      summary.meetingId
                    }
                    align="center"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {summary.presentCount}
                    /
                    {register.totalMembers}
                  </TableCell>
                ),
              )}

              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Paper
  sx={{
    p: 2,
    mb: 2,
  }}
  className="print-header"
>
  <Typography variant="h5">
    Attendance Register
  </Typography>

  <Typography>
    Financial Year :
    {" "}
    {register.financialYearName}
  </Typography>

  <Typography>
    Members :
    {" "}
    {register.totalMembers}
  </Typography>

  <Typography>
    Meetings :
    {" "}
    {register.meetings.length}
  </Typography>

  <Typography>
    Generated :
    {" "}
    {new Date().toLocaleDateString(
      "en-GB",
    )}
  </Typography>
</Paper>
<Paper
  sx={{
    mt: 2,
    p: 2,
  }}
>
  <Typography
    variant="subtitle2"
    gutterBottom
  >
    Legend
  </Typography>

  <Typography>
    ✓ = Present
  </Typography>

  <Typography>
    A = Absent
  </Typography>

  <Typography>
    L = Leave
  </Typography>
</Paper>
    </>
  );
}