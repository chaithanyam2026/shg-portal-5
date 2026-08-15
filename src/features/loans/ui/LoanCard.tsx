"use client";

import Link from "next/link";

import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Button } from "@mui/material";

import type { LoanSummary } from "../types";

type Props = {
  loan: LoanSummary;
};

export default function LoanCard({ loan }: Props) {
  const statusColor = {
    ACTIVE: "success",
    CLOSED: "default",
  }[loan.status] as "success" | "default";

  return (
    <Card>
      <CardActionArea component={Link} href={`/loans/${loan._id}`}>
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
                <strong>Disbursed:</strong> ₹{loan.disbursedAmount.toLocaleString()}
              </Typography>

              <Typography variant="body2">
                <strong>Min. Monthly:</strong>{" "}
                {loan.expectedMonthlyRepayment > 0
                  ? `₹${loan.expectedMonthlyRepayment.toLocaleString()}`
                  : "No minimum"}
              </Typography>

              <Typography variant="body2">
                <strong>Outstanding:</strong> ₹{loan.outstandingPrincipal.toLocaleString()}
              </Typography>

              <Typography variant="body2">
                <strong>Date:</strong> {new Date(loan.disbursedDate).toLocaleDateString()}
              </Typography>
            </Stack>
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
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
