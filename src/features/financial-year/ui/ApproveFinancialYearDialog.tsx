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

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(function SnackbarAlert(props, ref) {
  return <MuiAlert ref={ref} elevation={6} variant="filled" {...props} />;
});

export default function ApproveFinancialYearDialog({
  open,
  financialYearId,
  financialYearName,
  onClose,
  onSuccess,
}: Props) {
  const router = useRouter();

  const [loadingValidation, setLoadingValidation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ClosingValidation | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const loading = loadingValidation || submitting;
  const canCloseDialog = useMemo(() => !loading, [loading]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSubmitting(false);
    setCompleted(false);
    setError(null);
    setValidation(null);
    setSnackbarOpen(false);
    setSnackbarMessage("");
    setSnackbarSeverity("success");

    async function loadValidation() {
      try {
        setLoadingValidation(true);

        const response = await fetch(
          `/api/financial-years/${financialYearId}/approve-validation`,
        );

        const result = (await response.json()) as ClosingValidation | { message: string };

        if (!response.ok) {
          throw new Error("message" in result ? result.message : "Unable to load validation.");
        }

        setValidation(result as ClosingValidation);
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : "Unable to load validation.";

        setError(message);
        setSnackbarSeverity("error");
        setSnackbarMessage(message);
        setSnackbarOpen(true);
      } finally {
        setLoadingValidation(false);
      }
    }

    void loadValidation();
  }, [open, financialYearId]);

  function handleCancel() {
    if (loading) {
      return;
    }

    onClose();
  }

  function handleCompleted() {
    onClose();
    onSuccess();
  }

  async function handleApproveFinancialYear() {
    if (loading || completed || !validation?.valid) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api/financial-years/${financialYearId}/approve`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to approve financial year.");
      }

      setCompleted(true);
      setSnackbarSeverity("success");
      setSnackbarMessage(`Financial year "${financialYearName}" was approved successfully.`);
      setSnackbarOpen(true);
      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to approve financial year.";

      setError(message);
      setSnackbarSeverity("error");
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
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
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Approve Financial Year</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Typography>
              Confirm that reports for <strong>{financialYearName}</strong> have been reviewed and
              approved by the committee and members.
            </Typography>

            <Alert severity="warning" variant="outlined">
              <AlertTitle>Approval Confirmation</AlertTitle>
              Once approved, the financial year can be permanently closed. All active loans must be
              closed before approval.
            </Alert>

            <Divider />

            {loadingValidation && (
              <Stack spacing={2} sx={{ alignItems: "center", py: 4 }}>
                <CircularProgress size={42} />
                <Typography>Loading approval checks...</Typography>
              </Stack>
            )}

            {!loadingValidation && completed && (
              <Alert severity="success" variant="filled">
                Financial year approved successfully. You can now close the financial year.
              </Alert>
            )}

            {!loadingValidation && error && (
              <Alert severity="error" variant="filled">
                {error}
              </Alert>
            )}

            {!loadingValidation && validation && (
              <ClosingValidationList validation={validation} />
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="inherit" disabled={loading || completed} onClick={handleCancel}>
            Cancel
          </Button>

          {!completed && (
            <Button
              variant="contained"
              color="success"
              disabled={loading || !validation?.valid}
              onClick={handleApproveFinancialYear}
            >
              {submitting ? "Approving..." : "Approve Financial Year"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <SnackbarAlert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </SnackbarAlert>
      </Snackbar>
    </>
  );
}
