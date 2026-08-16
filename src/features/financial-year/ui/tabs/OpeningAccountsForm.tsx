"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { FinancialYearDetails } from "../../types";

type Props = {
  financialYear: FinancialYearDetails;
  canEdit?: boolean;
};

type OpeningBalances = {
  bankBalance: number;
  cashInHand: number;
  excessCorpus: number;
  investments: number;
  otherLoans: number;
};

export default function OpeningAccountsForm({ financialYear, canEdit = true }: Props) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [balances, setBalances] = useState<OpeningBalances>({
    bankBalance: financialYear.openingBalances.bankBalance,

    cashInHand: financialYear.openingBalances.cashInHand,

    excessCorpus: financialYear.openingBalances.excessCorpus,

    investments: financialYear.openingBalances.investments,

    otherLoans: financialYear.openingBalances.otherLoans,
  });

  function updateField(field: keyof OpeningBalances, value: string) {
    setSuccess(false);
    setBalances((previous) => ({
      ...previous,
      [field]: value === "" ? 0 : Number(value),
    }));
  }

  async function save() {
    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      const response = await fetch(`/api/financial-years/${financialYear._id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          openingBalances: balances,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to save opening balances.");
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to save opening balances.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">Opening Accounts</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          {success && <Alert severity="success">Opening accounts saved successfully.</Alert>}

          <TextField
            label="Bank Balance"
            type="number"
            fullWidth
            disabled={!canEdit || saving}
            value={balances.bankBalance}
            onChange={(e) => updateField("bankBalance", e.target.value)}
          />

          <TextField
            label="Cash in Hand"
            type="number"
            fullWidth
            disabled={!canEdit || saving}
            value={balances.cashInHand}
            onChange={(e) => updateField("cashInHand", e.target.value)}
          />

          <TextField
            label="Excess Corpus"
            type="number"
            fullWidth
            disabled={!canEdit || saving}
            value={balances.excessCorpus}
            onChange={(e) => updateField("excessCorpus", e.target.value)}
          />

          <TextField
            label="Investments"
            type="number"
            fullWidth
            disabled={!canEdit || saving}
            value={balances.investments}
            onChange={(e) => updateField("investments", e.target.value)}
          />

          <TextField
            label="Other Loans"
            type="number"
            fullWidth
            disabled={!canEdit || saving}
            value={balances.otherLoans}
            onChange={(e) => updateField("otherLoans", e.target.value)}
          />

          <Button
            variant="contained"
            onClick={save}
            disabled={!canEdit || saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            Save Opening Accounts
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
