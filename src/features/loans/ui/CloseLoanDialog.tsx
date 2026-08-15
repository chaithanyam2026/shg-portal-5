"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { parseDateInputValue, toCalendarDate } from "@/lib/utils/date";

import type { LoanDetails } from "../types";
import { formatCurrency } from "./format";

type Props = {
  loan: LoanDetails | null;
  onClose(): void;
  onSuccess(): void;
};

type CloseSummaryRow = {
  label: string;
  value: number;
  emphasize?: boolean;
};

function toDateInputValue(value: Date | string): string {
  const date = toCalendarDate(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

function CloseSummaryItem({ label, value, emphasize = false }: CloseSummaryRow) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="body2" color={emphasize ? "text.primary" : "text.secondary"}>
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: emphasize ? 700 : 500,
          color: emphasize ? "text.primary" : "text.secondary",
        }}
      >
        {formatCurrency(value)}
      </Typography>
    </Stack>
  );
}

export default function CloseLoanDialog({ loan, onClose, onSuccess }: Props) {
  const router = useRouter();

  const [comment, setComment] = useState("");
  const [closedDate, setClosedDate] = useState(toDateInputValue(new Date()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loan) {
      return;
    }

    setComment("");
    setClosedDate(toDateInputValue(new Date()));
    setError("");
    setLoading(false);
  }, [loan]);

  function handleClose() {
    if (loading) {
      return;
    }

    onClose();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!loan) {
      return;
    }

    if (!closedDate) {
      setError("Please select the loan close date.");
      return;
    }

    if (
      parseDateInputValue(closedDate) < parseDateInputValue(toDateInputValue(loan.disbursedDate))
    ) {
      setError("Close date cannot be before the loan start date.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/loans/${loan._id}/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment,
          closedDate: parseDateInputValue(closedDate),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to close loan.");
      }

      onSuccess();
      router.refresh();
    } catch (closeError) {
      setError(closeError instanceof Error ? closeError.message : "Unable to close loan.");
    } finally {
      setLoading(false);
    }
  }

  const requiresApprovalNote =
    loan && !loan.isClosable && loan.financialYearStatus === "APPROVED";

  const summaryRows: CloseSummaryRow[] = loan
    ? [
        { label: "Outstanding Principal", value: loan.outstandingPrincipal },
        { label: "Pending Interest", value: loan.pendingInterest },
        { label: "Pending Loan Fine", value: loan.pendingLoanFine },
        { label: "Pending Absent Fine", value: loan.pendingAbsentFine },
        { label: "Pending Contribution", value: loan.pendingContribution },
        { label: "Total", value: loan.closeTotal, emphasize: true },
      ]
    : [];

  return (
    <Dialog open={loan !== null} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Close Loan</DialogTitle>

      <DialogContent>
        <Stack
          component="form"
          id="close-loan-form"
          spacing={2}
          sx={{ mt: 1 }}
          onSubmit={handleSubmit}
        >
          {loan && (
            <Typography variant="body2" color="text.secondary">
              Closing <strong>{loan.loanNumber}</strong> for {loan.memberName}.
            </Typography>
          )}

          {loan && (
            <Stack
              spacing={1.5}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Closing Balances
              </Typography>

              {summaryRows.map((row) => (
                <CloseSummaryItem key={row.label} {...row} />
              ))}
            </Stack>
          )}

          {requiresApprovalNote && (
            <Alert severity="warning">
              This loan still has outstanding balances. It can be closed because the financial year
              is approved. Add a comment explaining why it is being closed.
            </Alert>
          )}

          {loan?.isClosable && (
            <Alert severity="success">
              All outstanding amounts are cleared. This loan can be closed.
            </Alert>
          )}

          <Divider />

          <TextField
            label="Close Date"
            type="date"
            required
            fullWidth
            value={closedDate}
            onChange={(event) => setClosedDate(event.target.value)}
            helperText="Repayments after this date are not included in the passbook."
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="Closing Comment"
            required
            fullWidth
            multiline
            minRows={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            helperText="A comment is required to close the loan."
          />

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="close-loan-form"
          variant="contained"
          color="warning"
          disabled={loading || !comment.trim() || !closedDate}
        >
          {loading ? "Closing..." : "Close Loan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
