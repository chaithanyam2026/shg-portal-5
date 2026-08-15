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

import {
  getMemberContributionTotal,
  getMemberLoanTotal,
  getTotalsContributionTotal,
  getTotalsLoanTotal,
} from "../domain/member-financial-summary-matrix";

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
  {
    key: "contribution",
    label: "Contribution",
    description: "Paid + pending contribution",
  },
  {
    key: "loan",
    label: "Loan",
    description: "Outstanding loan + pending contribution + pending loan interest + pending loan fine + pending absent fine",
  },
  {
    key: "specialLoan",
    label: "Special Loan & Expiry",
    description: "Outstanding special loan and expiry date",
  },
] as const;

export default function FinancialYearEndMemberSummaryMatrix({ report }: Props) {
  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography variant="h6">Member Summary Matrix</Typography>

        <Typography variant="body2" color="text.secondary">
          Member names are listed in the first column with contribution, loan, and special loan
          totals shown horizontally.
        </Typography>
      </Stack>

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
                <TableCell key={column.key} align="right" sx={{ minWidth: 180 }}>
                  <Stack spacing={0.25} sx={{ alignItems: "flex-end" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {column.label}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: "right" }}>
                      {column.description}
                    </Typography>
                  </Stack>
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

                  <TableCell align="right">
                    {formatCurrency(getMemberContributionTotal(row))}
                  </TableCell>

                  <TableCell align="right">{formatCurrency(getMemberLoanTotal(row))}</TableCell>

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
                    {formatCurrency(getTotalsContributionTotal(report.totals))}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatCurrency(getTotalsLoanTotal(report.totals))}
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
    </Stack>
  );
}
