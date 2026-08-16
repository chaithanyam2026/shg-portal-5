"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { MemberDetails } from "../../types";

import { formatCurrency, formatDate } from "@/lib/utils/format";

type LoanSummary = {
  _id: string;

  loanNumber: string;

  loanType: string;

  status: string;

  disbursedAmount: number;

  disbursedDate: string;

  outstandingPrincipal: number;
};

type Props = {
  financialYearId: string;

  member: MemberDetails;

  canViewLoanDetails?: boolean;
};

export default function LoansTab({
  member,
  financialYearId,
  canViewLoanDetails = false,
}: Props) {
  const [loans, setLoans] = useState<LoanSummary[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!financialYearId) {
        setLoans([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          financialYearId,
        });

        const response = await fetch(`/api/members/${member._id}/loans?${params.toString()}`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message ?? "Unable to load loans.");
        }

        setLoans(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load loans.");
        setLoans([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [member._id, financialYearId]);

  if (!financialYearId) {
    return <Alert severity="info">Select a financial year to view loans.</Alert>;
  }

  if (loading) {
    return (
      <Stack
        sx={{
          alignItems: "center",
          py: 5,
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loans.length === 0) {
    return <Alert severity="info">No loans found for this member.</Alert>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Loans
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Loan No</TableCell>

                <TableCell>Type</TableCell>

                <TableCell>Disbursed</TableCell>

                <TableCell align="right">Amount</TableCell>

                <TableCell align="right">Outstanding</TableCell>

                <TableCell>Status</TableCell>

                {canViewLoanDetails && (
                  <TableCell align="center">Action</TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id} hover>
                  <TableCell>{loan.loanNumber}</TableCell>

                  <TableCell>{loan.loanType}</TableCell>

                  <TableCell>{formatDate(loan.disbursedDate)}</TableCell>

                  <TableCell align="right">{formatCurrency(loan.disbursedAmount)}</TableCell>

                  <TableCell align="right">{formatCurrency(loan.outstandingPrincipal)}</TableCell>

                  <TableCell>
                    <Chip
                      label={loan.status}
                      size="small"
                      color={loan.status === "ACTIVE" ? "success" : "default"}
                    />
                  </TableCell>

                  {canViewLoanDetails && (
                    <TableCell align="center">
                      <Button
                        component={Link}
                        href={`/loans/${loan._id}`}
                        size="small"
                        variant="outlined"
                      >
                        View
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
