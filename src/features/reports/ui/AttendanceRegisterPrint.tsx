"use client";

import { useEffect } from "react";

import {
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import type {
  AttendanceRegister,
} from "../domain";

import AttendanceRegisterPrintCell from "./AttendanceRegisterPrintCell";
import AttendanceRegisterPrintSummary from "./AttendanceRegisterPrintSummary";
import AttendanceRegisterPrintToolbar from "./AttendanceRegisterPrintToolbar";

type Props = {
  financialYearId: string;

  register: AttendanceRegister;

  shgName?: string;

  financialYearName?: string;
};

/**
 * Printable Attendance Register.
 *
 * Optimized for A4 landscape.
 */
export default function AttendanceRegisterPrint({
  financialYearId,
  register,
  shgName = "Self Help Group",
  financialYearName,
}: Props) {
  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        window.print();
      }, 500);

    return () =>
      window.clearTimeout(timer);
  }, []);

  return (
    <Stack
      spacing={3}
      className="print-page"
      sx={{
        p: 3,
        bgcolor:
          "background.paper",

        "@media print": {
          p: 0,
        },
      }}
    >
      <AttendanceRegisterPrintToolbar
        backHref={`/reports/attendance/${financialYearId}`}
      />

      <Stack spacing={0.5}>
        <Typography
          variant="h5"
          fontWeight={700}
          align="center"
        >
          {shgName}
        </Typography>

        <Typography
          variant="h6"
          align="center"
        >
          Attendance Register
        </Typography>

        {financialYearName && (
          <Typography
            align="center"
          >
            Financial Year :{" "}
            {financialYearName}
          </Typography>
        )}

        <Typography
          align="center"
          variant="body2"
        >
          Printed On :{" "}
          {new Date().toLocaleDateString(
            "en-IN",
          )}
        </Typography>
      </Stack>

      <Divider />

      <Box
        sx={{
          overflowX:
            "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
            fontSize: 11,
          }}
        >
          <thead>
            <tr>
              <th>
                Sl
              </th>

              <th>
                Code
              </th>

              <th
                style={{
                  minWidth: 180,
                }}
              >
                Member
              </th>

              {register.meetings.map(
                (
                  meeting,
                ) => (
                  <th
                    key={
                      meeting.meetingId
                    }
                  >
                    {meeting.meetingDate.toLocaleDateString(
                      "en-IN",
                    )}
                  </th>
                ),
              )}

              <th>
                Total
              </th>

              <th>
                Paid
              </th>

              <th>
                Balance
              </th>
            </tr>
          </thead>

          <tbody>
            {register.rows.map(
              (
                row,
                index,
              ) => (
                <tr
                  key={
                    row.memberId
                  }
                >
                  <td>
                    {index + 1}
                  </td>

                  <td>
                    {
                      row.memberCode
                    }
                  </td>

                  <td>
                    {
                      row.memberName
                    }
                  </td>

                  {row.attendance.map(
                    (
                      cell,
                    ) => (
                      <td
                        key={
                          cell.meetingId
                        }
                        style={{
                          textAlign:
                            "center",
                        }}
                      >
                        <AttendanceRegisterPrintCell
                          cell={
                            cell
                          }
                        />
                      </td>
                    ),
                  )}

                  <td
                    style={{
                      textAlign:
                        "right",
                    }}
                  >
                    ₹
                    {row.totalFine}
                  </td>

                  <td
                    style={{
                      textAlign:
                        "right",
                    }}
                  >
                    ₹
                    {row.paidFine}
                  </td>

                  <td
                    style={{
                      textAlign:
                        "right",
                    }}
                  >
                    ₹
                    {row.pendingFine}
                  </td>
                </tr>
              ),
            )}
          </tbody>

          <tfoot>
            <AttendanceRegisterPrintSummary
              register={
                register
              }
            />
          </tfoot>
        </table>
      </Box>

      <Divider />

      <Stack
        spacing={0.75}
        sx={{
          fontSize: 12,
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
        >
          Legend
        </Typography>

        <Typography variant="body2">
          ✓ — Present
        </Typography>

        <Typography variant="body2">
          L — Approved Leave
        </Typography>

        <Typography variant="body2">
          A10 — First
          Consecutive Absence
          (₹10)
        </Typography>

        <Typography variant="body2">
          A20 — Second
          Consecutive Absence
          (₹20)
        </Typography>

        <Typography variant="body2">
          A70 — Third
          Consecutive Absence
          (₹70)
        </Typography>

        <Typography variant="body2">
          A100 — Fourth &
          Subsequent
          Consecutive
          Absence (₹100)
        </Typography>
      </Stack>

      <style jsx>{`
        table,
        th,
        td {
          border: 1px solid #000;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 4px;
          font-size: 10px;
        }

        th {
          text-align: center;
          font-weight: bold;
          white-space: nowrap;
        }

        td {
          vertical-align: middle;
        }

        thead {
          display: table-header-group;
        }

        tfoot {
          display: table-footer-group;
        }

        tr {
          page-break-inside: avoid;
        }

        .print-page {
          background: #fff;
        }

        .no-print {
          display: flex;
        }

        @page {
          size: A4 landscape;
          margin: 12mm;
        }

        @media print {
          .no-print {
            display: none !important;
          }

          body {
            margin: 0;
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .print-page {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </Stack>
  );
}