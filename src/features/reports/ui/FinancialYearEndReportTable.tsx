"use client";

import {
  Box,
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

import { formatDate } from "@/lib/utils/date";

import type { MemberFinancialSummary } from "../domain/member-financial-summary";

import {
  stickyMemberNameCellSx,
  stickyMemberSerialCellSx,
  stickyMemberTotalsCellSx,
} from "./sticky-member-table-styles";

type Props = {
  report: MemberFinancialSummary;
};

function formatCurrency(value: number) {
  return `₹ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatSpecialLoan(amount: number, expiry: string | null) {
  if (amount <= 0 && !expiry) {
    return "-";
  }

  return (
    <Stack spacing={0.25} sx={{ alignItems: "flex-end" }}>
      <Typography variant="body2">{amount > 0 ? formatCurrency(amount) : "-"}</Typography>

      {expiry && (
        <Typography variant="caption" color="text.secondary">
          Exp: {formatDate(expiry)}
        </Typography>
      )}
    </Stack>
  );
}

const COLUMNS = [
  { key: "paidContribution", label: "Paid Contribution", align: "right" as const },
  { key: "paidAbsentFine", label: "Paid Absent Fine", align: "right" as const },
  { key: "paidLoanInterest", label: "Paid Loan Interest", align: "right" as const },
  { key: "paidLoanFine", label: "Paid Loan Fine", align: "right" as const },
  { key: "outstandingLoan", label: "Outstanding Loan", align: "right" as const },
  { key: "pendingContribution", label: "Pending Contribution", align: "right" as const },
  { key: "pendingLoanInterest", label: "Pending Loan Interest", align: "right" as const },
  { key: "pendingLoanFine", label: "Pending Loan Fine", align: "right" as const },
  { key: "pendingAbsentFine", label: "Pending Absent Fine", align: "right" as const },
  { key: "specialLoan", label: "Special Loan & Expiry", align: "right" as const },
];

export default function FinancialYearEndReportTable({ report }: Props) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        maxHeight: 720,
        overflow: "auto",
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={stickyMemberSerialCellSx(true)}>
              Sl. No.
            </TableCell>

            <TableCell sx={stickyMemberNameCellSx(true)}>Member</TableCell>

            {COLUMNS.map((column) => (
              <TableCell key={column.key} align={column.align} sx={{ minWidth: 120 }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {report.rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMNS.length + 2} align="center">
                <Typography color="text.secondary">No members found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            report.rows.map((row, index) => (
              <TableRow key={row.memberId} hover>
                <TableCell align="center" sx={stickyMemberSerialCellSx()}>
                  {index + 1}
                </TableCell>

                <TableCell sx={stickyMemberNameCellSx()}>
                  <Box
                    sx={{
                      maxWidth: 160,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.memberName}
                  </Box>
                </TableCell>

                <TableCell align="right">{formatCurrency(row.contributionPaid)}</TableCell>

                <TableCell align="right">{formatCurrency(row.absentFinePaid)}</TableCell>

                <TableCell align="right">{formatCurrency(row.loanInterestPaid)}</TableCell>

                <TableCell align="right">{formatCurrency(row.loanFinePaid)}</TableCell>

                <TableCell align="right">{formatCurrency(row.outstandingLoan)}</TableCell>

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
                    color: row.loanInterestPending > 0 ? "error.main" : "text.primary",
                  }}
                >
                  {formatCurrency(row.loanInterestPending)}
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    color: row.loanFinePending > 0 ? "error.main" : "text.primary",
                  }}
                >
                  {formatCurrency(row.loanFinePending)}
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
                  {formatSpecialLoan(row.outstandingSpecialLoan, row.specialLoanExpiry)}
                </TableCell>
              </TableRow>
            ))
          )}

          {report.rows.length > 0 && (
            <TableRow>
              <TableCell colSpan={2} sx={stickyMemberTotalsCellSx()}>
                <Typography sx={{ fontWeight: 700 }}>Totals</Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(report.totals.contributionPaid)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(report.totals.absentFinePaid)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(report.totals.loanInterestPaid)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(report.totals.loanFinePaid)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(report.totals.outstandingLoan)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(report.totals.contributionToBePaid)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(report.totals.loanInterestPending)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(report.totals.loanFinePending)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(report.totals.absentFinePending)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(report.totals.outstandingSpecialLoan)}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
