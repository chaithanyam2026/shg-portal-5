"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Chip, Grid, Stack, Typography } from "@mui/material";

import CloseFinancialYearDialog from "../CloseFinancialYearDialog";

import type { FinancialYearDetails } from "../../types";

import { validateFinancialYear } from "../../services/validate";

import FinancialYearTimeline from "../FinancialYearTimeline";
import SummaryCard from "./SummaryCard";

type Props = {
  financialYear: FinancialYearDetails;
};

export default function SummaryTab({ financialYear }: Props) {
  const router = useRouter();

  const validation = validateFinancialYear(financialYear);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const opening = financialYear.openingBalances;

  const totalOpeningBalance =
    opening.bankBalance +
    opening.cashInHand +
    opening.excessCorpus +
    opening.investments -
    opening.otherLoans;

  const memberTotals = financialYear.openingMemberTotals;

  function openCloseDialog() {
    setCloseDialogOpen(true);
  }

  function closeCloseDialog() {
    setCloseDialogOpen(false);
  }

  function handleCloseSuccess() {
    setCloseDialogOpen(false);

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
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <SummaryCard title="Status" value={financialYear.status} />

            <Chip
              sx={{
                mt: 1,
              }}
              label={financialYear.status}
              color={getStatusColor()}
            />
            <FinancialYearTimeline status={financialYear.status} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <SummaryCard title="Members" value={financialYear.members.length} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <SummaryCard
              title="Opening Account Balance"
              value={`₹ ${totalOpeningBalance.toLocaleString("en-IN")}`}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <SummaryCard
              title="Total Contribution"
              value={`₹ ${memberTotals.contribution.toLocaleString("en-IN")}`}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <SummaryCard
              title="Total Loan"
              value={`₹ ${memberTotals.loan.toLocaleString("en-IN")}`}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <SummaryCard
              title="Total Special Loan"
              value={`₹ ${memberTotals.specialLoan.toLocaleString("en-IN")}`}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <SummaryCard
              title="Extra Corpus"
              value={`₹ ${opening.excessCorpus.toLocaleString("en-IN")}`}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
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

        {validation.valid ? (
          <Alert severity="success">Financial Year is ready to start.</Alert>
        ) : (
          <Alert severity="warning">
            Complete all required sections before starting the financial year.
          </Alert>
        )}

        {/*  {financialYear.status ===
          "IN_PROGRESS" && (
          <Alert severity="info">
            Financial Year is
            active.
          </Alert>
        )}

        {financialYear.status ===
          "CLOSED" && (
          <Alert severity="success">
            This financial year
            has been closed.

            <br />

            All meetings and
            financial records
            are now read-only.
          </Alert>
        )}

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <Stack spacing={1}>
          {validation.items.map(
            (
              item,
            ) => (
              <ValidationItem
                key={
                  item.label
                }
                label={
                  item.label
                }
                valid={
                  item.valid
                }
              />
            ),
          )}
        </Stack>

        {financialYear.status ===
          "DRAFT" && (
          <Button
            variant="contained"
            onClick={
              activate
            }
            disabled={
              !validation.valid ||
              loading
            }
            startIcon={
              loading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : undefined
            }
          >
            Start Financial
            Year
          </Button>
        )}

        {financialYear.status ===
          "APPROVED" && (
          <Button
            variant="contained"
            color="error"
            onClick={
              openCloseDialog
            }
          >
            Close Financial
            Year
          </Button>
        )} */}
        {financialYear.status === "DRAFT" && (
          <Alert severity="info">Configure the financial year before activating it.</Alert>
        )}

        {financialYear.status === "IN_PROGRESS" && (
          <Alert severity="success">Financial year is currently active.</Alert>
        )}

        {financialYear.status === "VALIDATED" && (
          <Alert severity="warning">Validation completed. Ready for approval.</Alert>
        )}

        {financialYear.status === "APPROVED" && (
          <Alert severity="success">Financial year has been approved and can now be closed.</Alert>
        )}

        {financialYear.status === "CLOSED" && (
          <Alert severity="info">
            Financial year has been closed. Historical records are read-only.
          </Alert>
        )}
      </Stack>

      <CloseFinancialYearDialog
        open={closeDialogOpen}
        financialYearId={financialYear._id}
        financialYearName={financialYear.name}
        onClose={closeCloseDialog}
        onSuccess={handleCloseSuccess}
      />
    </>
  );
}
