"use client";

import { forwardRef, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import MuiAlert, { AlertProps } from "@mui/material/Alert";

import type { ClosingValidation } from "../domain";

import ClosingValidationList from "./ClosingValidationList";

type Props = {
  open: boolean;
  financialYearId: string;
  financialYearName: string;
  onClose(): void;
  onSuccess(): void;
};

type CloseFinancialYearResponse =
  | {
      financialYearId: string;
      financialYearName: string;
      closedAt: string;
      summary: unknown;
      members: unknown[];
      validation: ClosingValidation;
    }
  | {
      message: string;
      validation?: ClosingValidation;
    };

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(function SnackbarAlert(props, ref) {
  return <MuiAlert ref={ref} elevation={6} variant="filled" {...props} />;
});

export default function CloseFinancialYearDialog({
  open,
  financialYearId,
  financialYearName,
  onClose,
  onSuccess,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [completed, setCompleted] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [validation, setValidation] = useState<ClosingValidation | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const canCloseDialog = useMemo(() => !loading, [loading]);

  const dialogTitleId = "close-financial-year-title";

  const dialogDescriptionId = "close-financial-year-description";

  useEffect(() => {
    if (!open) {
      return;
    }

    setLoading(false);
    setCompleted(false);
    setSuccessMessage("");
    setError(null);
    setValidation(null);

    setSnackbarOpen(false);
    setSnackbarMessage("");
    setSnackbarSeverity("success");
  }, [open]);

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  function handleCancel() {
    if (loading) {
      return;
    }

    setError(null);
    setValidation(null);
    setCompleted(false);
    setSuccessMessage("");

    onClose();
  }

  function handleCompleted() {
    setError(null);
    setValidation(null);
    setCompleted(false);
    setSuccessMessage("");

    onClose();
    onSuccess();
  }

  async function handleCloseFinancialYear() {
    if (loading || completed) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setValidation(null);
      setCompleted(false);
      setSuccessMessage("");

      const response = await fetch(`/api/financial-years/${financialYearId}/close`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
        },
      });

      const result = (await response.json()) as CloseFinancialYearResponse;

      if (!response.ok) {
        const message = "message" in result ? result.message : "Unable to close financial year.";

        setError(message);

        if ("validation" in result && result.validation) {
          setValidation(result.validation);
        }

        setSnackbarSeverity("error");
        setSnackbarMessage(message);
        setSnackbarOpen(true);

        return;
      }

      if (result.validation && !result.validation.valid) {
        setValidation(result.validation);

        const message = "Financial year cannot be closed.";

        setError(message);

        setSnackbarSeverity("error");
        setSnackbarMessage(message);
        setSnackbarOpen(true);

        return;
      }

      setCompleted(true);

      setSuccessMessage(`Financial year "${financialYearName}" was closed successfully.`);

      setSnackbarSeverity("success");

      setSnackbarMessage("Financial year closed successfully.");

      setSnackbarOpen(true);

      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error.";

      setError(message);

      setSnackbarSeverity("error");

      setSnackbarMessage(message);

      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!completed) {
      return;
    }

    const timer = window.setTimeout(() => {
      handleCompleted();
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [completed]);

  return (
    <>
      <Dialog
        open={open}
        onClose={(_event, reason) => {
          if (!canCloseDialog) {
            return;
          }

          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            handleCancel();
            return;
          }

          handleCancel();
        }}
        fullWidth
        maxWidth="sm"
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
        PaperProps={{
          sx: {
            cursor: loading ? "progress" : "default",
          },
        }}
      >
        <DialogTitle id={dialogTitleId}>Close Financial Year</DialogTitle>

        <DialogContent dividers id={dialogDescriptionId}>
          <Stack spacing={3}>
            <Typography>
              You are about to permanently close the following financial year.
            </Typography>

            <Alert severity="warning" variant="outlined">
              <AlertTitle>Confirmation</AlertTitle>
              <strong>{financialYearName}</strong>
              <br />
              This action cannot be undone.
              <br />
              <br />
              Once the financial year is closed:
              <ul
                style={{
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                <li>Meetings become read-only.</li>

                <li>Financial transactions cannot be modified.</li>

                <li>Historical reports are preserved.</li>

                <li>Opening balances can be generated for the next financial year.</li>
              </ul>
            </Alert>

            <Divider />

            {loading && (
              <Stack
                spacing={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
                py={5}
              >
                <CircularProgress size={42} thickness={4} />

                <Typography textAlign="center">
                  Validating records and closing the financial year.
                </Typography>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                  This may take a few seconds.
                </Typography>
              </Stack>
            )}

            {!loading && completed && (
              <Stack spacing={2}>
                <Alert severity="success" variant="filled">
                  {successMessage}
                  <br />
                  <br />
                  Historical records have been preserved.
                  <br />
                  Opening balances can now be generated for the next financial year.
                  <br />
                  This financial year is now read-only.
                </Alert>

                <Typography align="center" color="text.secondary">
                  You can now create the next financial year and carry forward the opening balances.
                </Typography>
              </Stack>
            )}

            {!loading && error && (
              <Alert severity="error" variant="filled">
                {error}

                {validation && (
                  <>
                    <br />
                    <br />
                    Review the validation results below before trying again.
                  </>
                )}
              </Alert>
            )}

            {!loading && validation && (
              <Stack spacing={2}>
                <Typography variant="h6">Validation Result</Typography>

                <ClosingValidationList validation={validation} />
              </Stack>
            )}
          </Stack>
        </DialogContent>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            px: 3,
            pt: 2,
            display: "block",
          }}
        >
          Closing a financial year is irreversible. Ensure all meetings, loans and financial records
          are complete before continuing.
        </Typography>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Button
            color="inherit"
            disableElevation
            disabled={loading || completed}
            onClick={completed ? handleCompleted : handleCancel}
          >
            {completed ? "Close" : "Cancel"}
          </Button>

          {!completed && (
            <Button
              autoFocus
              variant="contained"
              color="error"
              disableElevation
              disabled={loading || completed}
              onClick={handleCloseFinancialYear}
            >
              {loading ? "Closing Financial Year..." : "Close Financial Year"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <SnackbarAlert severity={snackbarSeverity} onClose={handleSnackbarClose}>
          {snackbarMessage}
        </SnackbarAlert>
      </Snackbar>
    </>
  );
}
