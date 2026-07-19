"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MobileStepper,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import type { OpeningBalanceResult } from "../domain";

import OpeningBalancePreview from "./OpeningBalancePreview";

import MemberOpeningBalanceTable from "./MemberOpeningBalanceTable";

import type { ClosedFinancialYearLookup, CreateFinancialYearDraft } from "../types";

import FinancialYearDetailsStep from "./FinancialYearDetailsStep";
import FinancialYearSourceSelector from "./FinancialYearSourceSelector";

type Props = {
  financialYears: ClosedFinancialYearLookup[];
};

const STEPS = ["Source", "Details", "Opening Balance", "Members", "Confirmation"] as const;

export default function CreateFinancialYearWizard({ financialYears }: Props) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [creating, setCreating] = useState(false);

  const [sourceFinancialYearId, setSourceFinancialYearId] = useState("");

  const [financialYear, setFinancialYear] = useState<CreateFinancialYearDraft>({
    name: "",
    startDate: "",
    endDate: "",
    remarks: "",
  });

  const [openingBalance, setOpeningBalance] = useState<OpeningBalanceResult | null>(null);

  const [loadingOpening, setLoadingOpening] = useState(false);

  const [openingError, setOpeningError] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const selectedFinancialYear = useMemo(
    () => financialYears.find((fy) => fy._id === sourceFinancialYearId) ?? null,
    [financialYears, sourceFinancialYearId],
  );

  function handleNext() {
    switch (activeStep) {
      case 0:
        if (!sourceFinancialYearId) {
          return;
        }
        break;

      case 1:
        if (!financialYear.name || !financialYear.startDate || !financialYear.endDate) {
          return;
        }
        break;

      case 2:
        if (!openingBalance) {
          return;
        }

        break;

      case 3:
        if (!openingBalance || openingBalance.summary.members.length === 0) {
          return;
        }

        break;

      default:
        break;
    }

    setActiveStep((step) => Math.min(step + 1, STEPS.length - 1));
  }

  function handleBack() {
    setActiveStep((step) => Math.max(step - 1, 0));
  }

  async function loadOpeningBalance() {
    if (!sourceFinancialYearId) {
      return;
    }

    setLoadingOpening(true);

    setOpeningError("");

    try {
      const response = await fetch(
        `/api/financial-years/opening-balances?financialYearId=${sourceFinancialYearId}`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setOpeningBalance(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load opening balances.";

      setOpeningError(message);

      setSnackbarOpen(true);
    } finally {
      setLoadingOpening(false);
    }
  }

  async function createFinancialYear() {
    if (creating || !sourceFinancialYearId || !openingBalance) {
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/financial-years", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...financialYear,
          sourceFinancialYearId,
          openingBalances: openingBalance.summary.opening,
          memberOpeningBalances: openingBalance.summary.members,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      router.push(`/financial-years/${result._id}`);

      router.refresh();
    } catch (error) {
      setOpeningError(error instanceof Error ? error.message : "Unable to create financial year.");

      setSnackbarOpen(true);
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (activeStep !== 2) {
      return;
    }

    void loadOpeningBalance();
  }, [activeStep, sourceFinancialYearId]);

  return (
    <Stack spacing={3}>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h5">{STEPS[activeStep]}</Typography>

          <Typography variant="body2" color="text.secondary">
            Step {activeStep + 1} of {STEPS.length}
          </Typography>

          <MobileStepper
            variant="progress"
            position="static"
            steps={STEPS.length}
            activeStep={activeStep}
            nextButton={<Box />}
            backButton={<Box />}
          />
        </Stack>
      </Paper>

      <Card>
        <CardContent>
          {activeStep === 0 && (
            <Stack spacing={2}>
              <Typography variant="h6">Select Source Financial Year</Typography>

              <Typography variant="body2" color="text.secondary">
                Select the closed financial year that will provide the opening balances for the next
                financial year.
              </Typography>

              <FinancialYearSourceSelector
                financialYears={financialYears}
                value={sourceFinancialYearId}
                onChange={setSourceFinancialYearId}
              />
            </Stack>
          )}

          {activeStep === 1 && (
            <Stack spacing={2}>
              <Typography variant="h6">Financial Year Details</Typography>

              <FinancialYearDetailsStep value={financialYear} onChange={setFinancialYear} />
            </Stack>
          )}

          {activeStep === 2 && (
            <Stack spacing={3}>
              <Typography variant="h6">Opening Balance Preview</Typography>

              <Typography variant="body2" color="text.secondary">
                These balances will become the opening balances of the new financial year.
              </Typography>

              {loadingOpening && (
                <Stack
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 6,
                  }}
                >
                  <CircularProgress />
                </Stack>
              )}

              {!loadingOpening && openingBalance && (
                <OpeningBalancePreview opening={openingBalance.summary.opening} />
              )}

              {!loadingOpening && openingError && <Alert severity="error">{openingError}</Alert>}
            </Stack>
          )}

          {activeStep === 3 && (
            <Stack spacing={3}>
              <Typography variant="h6">Member Opening Balances</Typography>

              <Typography variant="body2" color="text.secondary">
                These balances will be carried forward for each member into the new financial year.
              </Typography>

              {!openingBalance ? (
                <Alert severity="warning">Opening balances have not been generated yet.</Alert>
              ) : openingBalance.summary.members.length === 0 ? (
                <Alert severity="info">No member balances are available.</Alert>
              ) : (
                <MemberOpeningBalanceTable members={openingBalance.summary.members} />
              )}
            </Stack>
          )}

          {activeStep === 4 && (
            <Stack spacing={3}>
              <Typography variant="h6">Confirmation</Typography>

              <Alert severity="success">
                Review the information below before creating the financial year.
              </Alert>

              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Typography>
                      <strong>Source Financial Year:</strong> {selectedFinancialYear?.name}
                    </Typography>

                    <Typography>
                      <strong>Name:</strong> {financialYear.name}
                    </Typography>

                    <Typography>
                      <strong>Start Date:</strong> {financialYear.startDate}
                    </Typography>

                    <Typography>
                      <strong>End Date:</strong> {financialYear.endDate}
                    </Typography>

                    <Typography>
                      <strong>Members:</strong> {openingBalance?.summary.members.length ?? 0}
                    </Typography>

                    <Typography>
                      <strong>Opening Bank Balance:</strong> ₹
                      {openingBalance?.summary.opening.bankBalance.toLocaleString("en-IN") ?? "0"}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Stack
        direction="row"
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          startIcon={<KeyboardArrowLeftIcon />}
          disabled={activeStep === 0 || creating}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button color="inherit" disabled={creating} onClick={() => router.push("/financial-years")}>
          Cancel
        </Button>

        <Button
          variant="contained"
          endIcon={activeStep === STEPS.length - 1 ? undefined : <KeyboardArrowRightIcon />}
          disabled={creating}
          onClick={() => {
            if (activeStep === STEPS.length - 1) {
              void createFinancialYear();
              return;
            }

            handleNext();
          }}
        >
          {creating ? (
            <>
              <CircularProgress
                size={18}
                color="inherit"
                sx={{
                  mr: 1,
                }}
              />
              Creating...
            </>
          ) : activeStep === STEPS.length - 1 ? (
            "Create Financial Year"
          ) : (
            "Next"
          )}
        </Button>
      </Stack>
      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {openingError}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
