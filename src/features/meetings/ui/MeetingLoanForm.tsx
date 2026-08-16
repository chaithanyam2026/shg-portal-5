"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useState } from "react";

import {
  Alert,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { formatDate } from "@/lib/utils/date";

import type { CreateLoanInput, CreateMeetingLoanInput } from "@/features/loans/validation";
import LoanForm from "@/features/loans/ui/LoanForm";

import type { MeetingLoansSummary } from "../types";

import { useMeetingDataRefresh } from "./MeetingDataRefresh";

type Props = {
  initialSummary: MeetingLoansSummary;
  readOnly?: boolean;
};

export default function MeetingLoanForm({ initialSummary, readOnly = false }: Props) {
  const router = useRouter();
  const { refreshMeetingData } = useMeetingDataRefresh();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isClosed = readOnly;
  const meetingDate = initialSummary.meetingDate.split("T")[0];

  async function handleSubmit(values: CreateLoanInput) {
    setLoading(true);
    setError("");
    setSuccess("");

    const payload: CreateMeetingLoanInput = {
      memberId: values.memberId,
      loanType: values.loanType,
      sanctionedAmount: values.sanctionedAmount,
      disbursedAmount: values.disbursedAmount,
      interestRate: values.interestRate,
      sanctionedDate: values.sanctionedDate,
      disbursedDate: values.disbursedDate,
        expiryDate: values.expiryDate,
      expectedMonthlyRepayment: values.expectedMonthlyRepayment,
      remarks: values.remarks,
    };

    try {
      const response = await fetch(`/api/meetings/${initialSummary.meetingId}/loans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to create loan.");
      }

      setSuccess(`Loan ${result.loanNumber} created successfully.`);

      refreshMeetingData();
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create loan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      {success && <Alert severity="success">{success}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Loans Disbursed in This Meeting</Typography>

            {initialSummary.loans.length === 0 ? (
              <Typography color="text.secondary">No loans have been created for this meeting.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Loan</TableCell>
                    <TableCell>Member</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Start Date</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {initialSummary.loans.map((loan) => (
                    <TableRow key={loan._id} hover>
                      <TableCell>
                        <Link href={`/loans/${loan._id}`}>{loan.loanNumber}</Link>
                      </TableCell>

                      <TableCell>
                        {loan.memberCode} — {loan.memberName}
                      </TableCell>

                      <TableCell>{loan.loanType}</TableCell>

                      <TableCell align="right">₹{loan.disbursedAmount.toLocaleString("en-IN")}</TableCell>

                      <TableCell>{formatDate(loan.disbursedDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Stack>
        </CardContent>
      </Card>

      {!isClosed ? (
        <LoanForm
          financialYearId={initialSummary.financialYearId}
          members={initialSummary.members}
          loading={loading}
          cancelHref={`/meetings/${initialSummary.meetingId}`}
          defaultSanctionedDate={meetingDate}
          defaultStartDate={meetingDate}
          onSubmit={handleSubmit}
        />
      ) : (
        <Alert severity="info">This meeting cannot be edited. New loans cannot be added.</Alert>
      )}
    </Stack>
  );
}
