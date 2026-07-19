"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
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

import type { MemberPassbook } from "../../domain";

import SummaryCard from "./SummaryCard";

import { formatCurrency, formatDate } from "@/lib/utils/format";

type Props = {
  member: MemberDetails;
};

export default function PassbookTab({ member }: Props) {
  const [passbook, setPassbook] = useState<MemberPassbook | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const response = await fetch(`/api/members/${member._id}/passbook`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setPassbook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load passbook.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [member._id]);

  if (loading) {
    return (
      <Stack
        sx={{
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!passbook) {
    return <Alert severity="info">Passbook not found.</Alert>;
  }

  if (passbook.entries.length === 0) {
    return <Alert severity="info">No contribution transactions found.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <SummaryCard title="Opening" value={formatCurrency(passbook.openingContribution)} />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <SummaryCard title="Meeting" value={formatCurrency(passbook.meetingContribution)} />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <SummaryCard title="Balance" value={formatCurrency(passbook.currentBalance)} />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <SummaryCard title="Entries" value={passbook.contributionCount} />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Contribution Passbook
          </Typography>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>

                  <TableCell>Description</TableCell>

                  <TableCell align="right">Contribution</TableCell>

                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {passbook.entries.map((entry) => (
                  <TableRow key={`${entry.type}-${entry.transactionDate}`}>
                    <TableCell>{formatDate(entry.transactionDate)}</TableCell>

                    <TableCell>{entry.description}</TableCell>

                    <TableCell align="right">{formatCurrency(entry.contribution)}</TableCell>

                    <TableCell align="right">{formatCurrency(entry.runningBalance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
}
