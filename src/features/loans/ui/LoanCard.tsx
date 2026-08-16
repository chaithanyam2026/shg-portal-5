"use client";

import Link from "next/link";

import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Button } from "@mui/material";

import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

import type { LoanSummary } from "../types";

type Props = {
  loan: LoanSummary;
  canViewDetails?: boolean;
};

export default function LoanCard({ loan, canViewDetails = false }: Props) {
  const statusColor = {
    ACTIVE: "success",
    CLOSED: "default",
  }[loan.status] as "success" | "default";

  const content = (
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">{loan.loanNumber}</Typography>

              <Chip label={loan.status} color={statusColor} size="small" />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Member:</strong> {loan.memberCode} — {loan.memberName}
              </Typography>

              <Typography variant="body2">
                <strong>Loan Type:</strong> {loan.loanType}
              </Typography>

              <Typography variant="body2">
                <strong>Disbursed:</strong> {formatCurrency(loan.disbursedAmount)}
              </Typography>

              <Typography variant="body2">
                <strong>Min. Monthly:</strong>{" "}
                {loan.expectedMonthlyRepayment > 0
                  ? formatCurrency(loan.expectedMonthlyRepayment)
                  : "No minimum"}
              </Typography>

              <Typography variant="body2">
                <strong>Outstanding principal:</strong> {formatCurrency(loan.outstandingPrincipal)}
              </Typography>

              <Typography variant="body2">
                <strong>Pending interest:</strong> {formatCurrency(loan.pendingInterest)}
              </Typography>

              <Typography variant="body2">
                <strong>Pending loan fine:</strong> {formatCurrency(loan.pendingLoanFine)}
              </Typography>

              <Typography variant="body2">
                <strong>Total pending:</strong> {formatCurrency(loan.totalPending)}
              </Typography>

              <Typography variant="body2">
                <strong>Date:</strong> {formatDate(loan.disbursedDate)}
              </Typography>
            </Stack>
            {canViewDetails && (
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Button size="small" endIcon={<ArrowForwardIosIcon />}>
                  View Details
                </Button>
              </Stack>
            )}
          </Stack>
        </CardContent>
  );

  if (!canViewDetails) {
    return <Card>{content}</Card>;
  }

  return (
    <Card>
      <CardActionArea component={Link} href={`/loans/${loan._id}`}>
        {content}
      </CardActionArea>
    </Card>
  );
}
