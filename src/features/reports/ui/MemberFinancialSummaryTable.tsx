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

import type { MemberFinancialSummary } from "../domain/member-financial-summary";

type Props = {
  report: MemberFinancialSummary;
};

function formatCurrency(value: number) {
  return `₹ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

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
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        maxHeight: 640,
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>

            <TableCell>Member</TableCell>

            <TableCell align="right">Contribution Paid</TableCell>

            <TableCell align="right">Contribution To Be Paid</TableCell>

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
              <TableCell colSpan={13} align="center">
                <Typography color="text.secondary">No members found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            report.rows.map((row) => (
              <TableRow key={row.memberId} hover>
                <TableCell>{row.memberCode}</TableCell>

                <TableCell>{row.memberName}</TableCell>

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
  );
}
