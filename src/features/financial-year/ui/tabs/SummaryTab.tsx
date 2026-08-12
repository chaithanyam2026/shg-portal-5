"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material";

import ApproveFinancialYearDialog from "../ApproveFinancialYearDialog";
import CloseFinancialYearDialog from "../CloseFinancialYearDialog";
import ValidateFinancialYearDialog from "../ValidateFinancialYearDialog";

import type { FinancialYearDetails } from "../../types";

import { validateFinancialYear } from "../../services/validate";

import FinancialYearTimeline from "../FinancialYearTimeline";
import SummaryCard from "./SummaryCard";
import ValidationItem from "./ValidationItem";

type Props = {
  financialYear: FinancialYearDetails;
};

export default function SummaryTab({ financialYear }: Props) {
  const router = useRouter();

  const validation = validateFinancialYear(financialYear);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validateDialogOpen, setValidateDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const opening = financialYear.openingBalances;

  const totalOpeningBalance =
    opening.bankBalance +
    opening.cashInHand +
    opening.excessCorpus +
    opening.investments -
    opening.otherLoans;

  const memberTotals = financialYear.members.reduce(
    (totals, member) => ({
      contribution: totals.contribution + member.opening.contribution,
      loan: totals.loan + member.opening.loan,
      specialLoan: totals.specialLoan + member.opening.specialLoan,
    }),
    {
      contribution: 0,
      loan: 0,
      specialLoan: 0,
    },
  );

  function handleStatusSuccess() {
    router.refresh();
  }

  function getStatusColor(): "default" | "primary" | "warning" | "success" | "error" {
    switch (financialYear.status) {
      case "DRAFT":
        return "default";

      case "IN_PROGRESS":
        return "primary";

      case "VALIDATED":
        return "warning";

      case "APPROVED":
        return "success";

      case "CLOSED":
        return "error";

      default:
        return "default";
    }
  }

  async function activate() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/financial-years/${financialYear._id}/activate`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to activate financial year.");
      }

      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to activate financial year.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h6">Financial Year Summary</Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryCard title="Status" value={financialYear.status} />

            <Chip
              sx={{ mt: 1 }}
              label={financialYear.status.replace("_", " ")}
              color={getStatusColor()}
            />

            <FinancialYearTimeline status={financialYear.status} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryCard title="Members" value={financialYear.members.length} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryCard
              title="Opening Account Balance"
              value={`₹ ${totalOpeningBalance.toLocaleString("en-IN")}`}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryCard
              title="Total Contribution"
              value={`₹ ${memberTotals.contribution.toLocaleString("en-IN")}`}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryCard
              title="Total Loan"
              value={`₹ ${memberTotals.loan.toLocaleString("en-IN")}`}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryCard
              title="Total Special Loan"
              value={`₹ ${memberTotals.specialLoan.toLocaleString("en-IN")}`}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryCard
              title="Extra Corpus"
              value={`₹ ${opening.excessCorpus.toLocaleString("en-IN")}`}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <SummaryCard
              title="Committee"
              value={
                validation.items.find((item) => item.label === "Executive Committee configured")
                  ?.valid
                  ? "Configured"
                  : "Incomplete"
              }
            />
          </Grid>
        </Grid>

        {financialYear.status === "DRAFT" && (
          <>
            {validation.valid ? (
              <Alert severity="success">Financial year is ready to start.</Alert>
            ) : (
              <Alert severity="warning">
                Complete all required sections before starting the financial year.
              </Alert>
            )}

            <Stack spacing={1}>
              {validation.items.map((item) => (
                <ValidationItem key={item.label} label={item.label} valid={item.valid} />
              ))}
            </Stack>

            <Button
              variant="contained"
              onClick={activate}
              disabled={!validation.valid || loading}
              startIcon={
                loading ? <CircularProgress size={18} color="inherit" /> : undefined
              }
            >
              Start Financial Year
            </Button>
          </>
        )}

        {financialYear.status === "IN_PROGRESS" && (
          <>
            <Alert severity="success">Financial year is currently active.</Alert>

            <Alert severity="info">
              After the end date passes, close all meetings and reconcile records before validating
              the financial year.
            </Alert>

            <Button variant="contained" color="warning" onClick={() => setValidateDialogOpen(true)}>
              Validate Financial Year
            </Button>
          </>
        )}

        {financialYear.status === "VALIDATED" && (
          <>
            <Alert severity="warning">
              Validation completed. Review and approve reports before closing the financial year.
            </Alert>

            <Button variant="contained" color="success" onClick={() => setApproveDialogOpen(true)}>
              Approve Financial Year
            </Button>
          </>
        )}

        {financialYear.status === "APPROVED" && (
          <>
            <Alert severity="success">
              Financial year has been approved and can now be permanently closed.
            </Alert>

            <Button variant="contained" color="error" onClick={() => setCloseDialogOpen(true)}>
              Close Financial Year
            </Button>
          </>
        )}

        {financialYear.status === "CLOSED" && (
          <Alert severity="info">
            Financial year has been closed. Historical records are read-only.
          </Alert>
        )}

        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <ValidateFinancialYearDialog
        open={validateDialogOpen}
        financialYearId={financialYear._id}
        financialYearName={financialYear.name}
        onClose={() => setValidateDialogOpen(false)}
        onSuccess={handleStatusSuccess}
      />

      <ApproveFinancialYearDialog
        open={approveDialogOpen}
        financialYearId={financialYear._id}
        financialYearName={financialYear.name}
        onClose={() => setApproveDialogOpen(false)}
        onSuccess={handleStatusSuccess}
      />

      <CloseFinancialYearDialog
        open={closeDialogOpen}
        financialYearId={financialYear._id}
        financialYearName={financialYear.name}
        onClose={() => setCloseDialogOpen(false)}
        onSuccess={handleStatusSuccess}
      />
    </>
  );
}
