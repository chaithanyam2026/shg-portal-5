"use client";

import { Alert, Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

import type { LoanDetails, LoanSummaryResult } from "../../types";

// import type { LoanSummaryResult } from "../../domain/loan-summary";


type Props = {
  loan: LoanDetails;
  summary: LoanSummaryResult;
};

export default function SummaryTab({ loan, summary }: Props) {
  return (
    <Box>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Outstanding Principal
                </Typography>

                <Typography variant="h5">
                  ₹{summary.outstandingPrincipal.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Total Payable
                </Typography>

                <Typography variant="h5">₹{summary.totalPayable.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Paid Principal
                </Typography>

                <Typography variant="h6">₹{summary.paidPrincipal.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Paid Interest
                </Typography>

                <Typography variant="h6">₹{summary.paidInterest.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Pending Interest
                </Typography>

                <Typography variant="h6">₹{summary.pendingInterest.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Paid Loan Fine
                </Typography>

                <Typography variant="h6">₹{summary.paidLoanFine.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Pending Loan Fine
                </Typography>

                <Typography variant="h6">₹{summary.pendingLoanFine.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Effective Interest (Interest Only)
                </Typography>

                <Typography variant="h6">
                  {summary.effectiveInterestPercentage.toFixed(2)}% p.a.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Effective Interest (Interest + Fines)
                </Typography>

                <Typography variant="h6">
                  {summary.effectiveInterestWithFinesPercentage.toFixed(2)}% p.a.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Loan Status
                </Typography>

                <Typography variant="h6">{loan.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Alert severity={loan.canBeClosed ? "success" : "info"}>
          {loan.status === "CLOSED"
            ? "This loan is closed."
            : loan.canBeClosed
              ? loan.isClosable
                ? "This loan is fully repaid and can be closed."
                : "This loan can be closed because the financial year is approved."
              : "This loan still has outstanding balances. It can be closed once fully repaid or when the financial year is approved."}
        </Alert>
      </Stack>
    </Box>
  );
}
