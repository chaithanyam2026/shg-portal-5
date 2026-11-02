"use client";

import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

import type { MemberFinancialSummary } from "../domain/member-financial-summary";
import { formatCurrency } from "@/lib/utils/currency";

type Props = {
  report: MemberFinancialSummary;
};

/* function formatCurrency(value: number) {
  return `₹ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
} */

const stripedBodySx: SxProps<Theme> = {
  "& tbody .MuiTableRow-root:nth-of-type(odd)": {
    bgcolor: "grey.100",
  },
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MemberFinancialSummaryTable({ report }: Props) {
  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
      /* sx={{
      maxHeight: 640,
    }} */
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>

              <TableCell >Member</TableCell>

              <TableCell align="right" sx={{
                pl: 0,
                pr: 0,
              }}>Contribution Paid<br />സമ്പാദ്യം അടച്ചത് </TableCell>

              <TableCell align="right">Contribution To Be Paid<br />സമ്പാദ്യം അടയ്ക്കാനുള്ളത്</TableCell>

              <TableCell align="right">Outstanding Loan</TableCell>

              <TableCell align="right">Outstanding Special Loan</TableCell>

              <TableCell align="center">Special Loan Expiry</TableCell>

              <TableCell align="right">Loan Interest Paid</TableCell>

              <TableCell align="right">Loan Interest Pending</TableCell>

              <TableCell align="right">Loan Fine Paid</TableCell>

              <TableCell align="right">Loan Fine Pending</TableCell>

              <TableCell align="right">Absent Fine Paid</TableCell>

              <TableCell align="right">Absent Fine Pending</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {report.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} align="center">
                  <Typography color="text.secondary">No members found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              report.rows.map((row) => (
                <TableRow key={row.memberId} hover>
                  <TableCell>{row.memberCode}</TableCell>

                  <TableCell sx={{
                    pl: 0,
                    pr: 0,
                  }}>{row.memberName}</TableCell>

                  <TableCell align="right">{formatCurrency(row.contributionPaid)}</TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color: row.contributionToBePaid > 0 ? "warning.main" : "text.primary",
                    }}
                  >
                    {formatCurrency(row.contributionToBePaid)}
                  </TableCell>

                  <TableCell align="right">{formatCurrency(row.outstandingLoan)}</TableCell>

                  <TableCell align="right">{formatCurrency(row.outstandingSpecialLoan)}</TableCell>

                  <TableCell align="center">{formatDate(row.specialLoanExpiry)}</TableCell>

                  <TableCell align="right">{formatCurrency(row.loanInterestPaid)}</TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color: row.loanInterestPending > 0 ? "error.main" : "text.primary",
                    }}
                  >
                    {formatCurrency(row.loanInterestPending)}
                  </TableCell>

                  <TableCell align="right">{formatCurrency(row.loanFinePaid)}</TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color: row.loanFinePending > 0 ? "error.main" : "text.primary",
                    }}
                  >
                    {formatCurrency(row.loanFinePending)}
                  </TableCell>

                  <TableCell align="right">{formatCurrency(row.absentFinePaid)}</TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color: row.absentFinePending > 0 ? "error.main" : "text.primary",
                      fontWeight: row.absentFinePending > 0 ? 600 : 400,
                    }}
                  >
                    {formatCurrency(row.absentFinePending)}
                  </TableCell>
                </TableRow>
              ))
            )}

            {report.rows.length > 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography sx={{ fontWeight: 700 }}>Totals</Typography>
                </TableCell>

                {/*   <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.contributionExpected)}
                  </Typography>
                </TableCell> */}

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.contributionPaid)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.contributionToBePaid)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.outstandingLoan)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.outstandingSpecialLoan)}
                  </Typography>
                </TableCell>

                <TableCell />

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.loanInterestPaid)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.loanInterestPending)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.loanFinePaid)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.loanFinePending)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.absentFinePaid)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(report.totals.absentFinePending)}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <br />

      <Stack
        spacing={0.25}
        sx={{
          alignItems: "center",
          mx: { xs: -1.5, sm: 0 },
        }}
      >
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ fontWeight: 600, fontSize: { xs: "0.95rem", sm: "1rem" }, lineHeight: 1.3 }}
        >
          Expected contribution: {formatCurrency(report.expectedContribution)}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, lineHeight: 1.3 }}
        >
          Last meeting closed:{" "}
          <Typography
            component="span"
            variant="body2"
            sx={{ fontWeight: 700, color: "text.primary", fontSize: "inherit" }}
          >
            {report.lastClosedMeetingDate ? formatDate(report.lastClosedMeetingDate) : "—"}
          </Typography>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, lineHeight: 1.3 }}
        >
          Opening {formatCurrency(report.openingContribution)} (opening contribution) +{" "}
          {report.closedMeetingCount} closed meetings × {formatCurrency(report.weeklyContribution)}{" "}
          weekly.
        </Typography>
      </Stack>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          mx: { xs: -1.5, sm: 0 },
          width: { xs: "calc(100% + 24px)", sm: "100%" },
        }}
      >
        <Table
          size="small"
          sx={{
            tableLayout: "fixed",
            width: "100%",
            ...stripedBodySx,
            "& .MuiTableCell-root": {
              px: 0.5,
              py: 0.5,
              fontSize: "0.7rem",
              lineHeight: 1.2,
            },
            "& thead .MuiTableCell-root": {
              fontSize: "0.65rem",
              fontWeight: 700,
              lineHeight: 1.15,
              py: 0.75,
              whiteSpace: "normal",
              bgcolor: "grey.50",
            },
            "& tbody .MuiTableCell-root": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "28%" }}>പേര്</TableCell>
              <TableCell align="right" sx={{ width: "18%" }}>
                സമ്പാദ്യം
              </TableCell>
              <TableCell align="right" sx={{ width: "15%" }}>
                ഫൈൻ
              </TableCell>
              <TableCell align="right" sx={{ width: "22%" }}>
                ലോൺ
              </TableCell>
              <TableCell align="right" sx={{ width: "17%" }}>
                ലോൺ ഫൈൻ
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {report.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">No members found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              report.rows.map((row) => (
                <TableRow key={row.memberId} hover>
                  <TableCell>{row.memberName}</TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color: row.contributionToBePaid > 0 ? "warning.main" : "text.primary",
                    }}
                  >
                    {formatCurrency(row.contributionToBePaid)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: row.absentFinePending > 0 ? "error.main" : "text.primary",
                      fontWeight: row.absentFinePending > 0 ? 600 : 400,
                    }}
                  >
                    {formatCurrency(row.absentFinePending)}
                  </TableCell>

                  <TableCell align="right">
                    {formatCurrency(
                      row.outstandingLoan + row.loanInterestPending + row.loanFinePending,
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: row.loanFinePending > 0 ? "error.main" : "text.primary",
                    }}
                  >
                    {formatCurrency(row.loanFinePending)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
    </>

  );
}
