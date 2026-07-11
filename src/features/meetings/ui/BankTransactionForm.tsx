"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import type {
  BankTransactionRecord,
  BankTransactionSummary,
} from "../types";

import BankTransactionTable from "./BankTransactionTable";

type Props = {
  meetingId: string;
  initialSummary: BankTransactionSummary;
};

export default function BankTransactionForm({
  meetingId,
  initialSummary,
}: Props) {
  const router = useRouter();

  const [records, setRecords] =
    useState(
      initialSummary.records,
    );

    const totals = useMemo(() => {
  let totalDeposits = 0;
  let totalWithdrawals = 0;

  for (const record of records) {
    switch (record.type) {
      case "DEPOSIT":
      case "INTEREST":
      case "INVESTMENT_MATURITY":
        totalDeposits += record.amount;
        break;

      case "WITHDRAWAL":
      case "INVESTMENT":
      case "BANK_CHARGE":
        totalWithdrawals += record.amount;
        break;
    }
  }

  return {
    totalDeposits,
    totalWithdrawals,
    netAmount:
      totalDeposits -
      totalWithdrawals,
  };
}, [records]);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function save() {
    try {
      setSaving(true);
      setError("");

      const response =
        await fetch(
          `/api/meetings/${meetingId}/bank`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              bankTransactions:
                records,
            }),
          },
        );

      if (!response.ok) {
        const body =
          await response.json();

        throw new Error(
          body.message ??
            "Unable to save bank transactions.",
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save bank transactions.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <BankTransactionTable
        records={records}
        disabled={saving}
        onChange={setRecords}
      />

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography>
              Deposits: ₹
              {
                totals.totalDeposits
              }
            </Typography>

            <Typography>
              Withdrawals: ₹
              {
                totals.totalWithdrawals
              }
            </Typography>

            <Typography variant="h6">
              Net Change: ₹
              {
      totals.netAmount
              }
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        disabled={saving}
        onClick={save}
      >
        Save Bank Transactions
      </Button>
    </Stack>
  );
}