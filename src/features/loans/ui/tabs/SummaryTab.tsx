"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import type {
    LoanDetails,
    LoanSummary,
} from "../../types";

type Props = {
    loan: LoanDetails;
};

export default function SummaryTab({
    loan,
}: Props) {
    const [
        summary,
        setSummary,
    ] = useState<LoanSummary | null>(
        null,
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {
        let cancelled =
            false;

        async function load() {
            try {
                setLoading(true);
                setError("");

                const response =
                    await fetch(
                        `/api/loans/${loan._id}/summary`,
                    );

                if (!response.ok) {
                    throw new Error(
                        "Unable to load loan summary.",
                    );
                }

                const data: LoanSummary =
                    await response.json();

                if (!cancelled) {
                    setSummary(data);
                }
            } catch (error) {
                if (!cancelled) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Unable to load loan summary.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [loan._id]);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                py={6}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }

    if (!summary) {
        return (
            <Alert severity="info">
                Loan summary not available.
            </Alert>
        );
    }

    return (
        <Box>
            <Stack spacing={3}>
                <Grid
                    container
                    spacing={2}
                >
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Outstanding Principal
                                </Typography>

                                <Typography variant="h5">
                                    ₹
                                    {summary.outstandingPrincipal.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Total Payable
                                </Typography>

                                <Typography variant="h5">
                                    ₹
                                    {summary.totalPayable.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Paid Interest
                                </Typography>

                                <Typography variant="h6">
                                    ₹
                                    {summary.paidInterest.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Pending Interest
                                </Typography>

                                <Typography variant="h6">
                                    ₹
                                    {summary.pendingInterest.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Pending Loan Fine
                                </Typography>

                                <Typography variant="h6">
                                    ₹
                                    {summary.pendingLoanFine.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Paid Loan Fine
                                </Typography>

                                <Typography variant="h6">
                                    ₹
                                    {summary.paidLoanFine.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Effective Interest
                                </Typography>

                                <Typography variant="h6">
                                    {summary.effectiveInterestPercentage}
                                    %
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Alert
                    severity={
                        summary.isClosable
                            ? "success"
                            : "info"
                    }
                >
                    {summary.isClosable
                        ? "This loan is eligible to be closed."
                        : "This loan still has outstanding amounts."}
                </Alert>
            </Stack>
        </Box>
    );
}