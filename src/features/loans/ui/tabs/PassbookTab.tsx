"use client";

import {
  Alert,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  formatCurrency,
  formatDate,
  formatNumber,
} from "../format";

import type {
  LoanPassbook,
} from "../../domain";

type Props = {
  passbook: LoanPassbook;
};

function formatAmount(
  value: number,
) {
  return `₹${value.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}

export default function PassbookTab({
  passbook,
}: Props) {
  if (
    passbook.entries.length === 0
  ) {
    return (
      <Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  mb={2}
>
  <Typography variant="h6">
    Loan Passbook
  </Typography>

  <Typography
    variant="body2"
    color="text.secondary"
  >
    {passbook.entries.length} Transactions
  </Typography>
</Stack>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        overflowX: "auto",
        borderRadius: 2,
      }}
    >
      <Table
        stickyHeader
        size="small"
        sx={{
          minWidth: 1400,
          whiteSpace: "nowrap",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>

            <TableCell>
              Description
            </TableCell>

            <TableCell align="right">
              Amount Paid
            </TableCell>

            <TableCell align="right">
              Interest Days
            </TableCell>

            <TableCell align="right">
              Interest Charged
            </TableCell>

            <TableCell align="right">
              Fine Charged
            </TableCell>

            <TableCell align="right">
              Interest Paid
            </TableCell>

            <TableCell align="right">
              Fine Paid
            </TableCell>

            <TableCell align="right">
              Principal Paid
            </TableCell>

            <TableCell align="right">
              Outstanding
            </TableCell>

            <TableCell align="right">
              Pending Interest
            </TableCell>

            <TableCell align="right">
              Pending Fine
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {passbook.entries.map(
            (
              entry,
              index,
            ) => (
              <TableRow key={index}>
                <TableCell>
                  {formatDate(
                    entry.transactionDate,
                  )}
                </TableCell>

                <TableCell>
                  {entry.description}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(
                    entry.amountPaid,
                  )}
                </TableCell>

                <TableCell align="right">
                  {formatNumber(
                    entry.interestDays,
                  )}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(
                    entry.interestCharged,
                  )}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(
                    entry.loanFineCharged,
                  )}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(
                    entry.paidInterest,
                  )}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(
                    entry.paidLoanFine,
                  )}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(
                    entry.paidPrincipal,
                  )}
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {formatCurrency(
                    entry.outstandingPrincipal,
                  )}

                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    color: "warning.main",
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(
                    entry.pendingInterest,
                  )}
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    color: "error.main",
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(
                    entry.pendingLoanFine,
                  )}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}