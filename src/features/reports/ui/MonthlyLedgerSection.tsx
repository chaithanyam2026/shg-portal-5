"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { formatCurrency } from "@/lib/utils/currency";

import type { MonthlyLedger } from "../types";
import { LedgerTable } from "./LedgerTable";

type Props = {
  ledger: MonthlyLedger;
};

type BalanceItemProps = {
  label: string;
  value: number;
};

function BalanceItem({ label, value }: BalanceItemProps) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography sx={{ fontWeight: 600 }}>{formatCurrency(value)}</Typography>
    </Stack>
  );
}

export function MonthlyLedgerSection({ ledger }: Props) {
  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container spacing={2} sx={{ width: "100%", alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6">
              {ledger.month} {ledger.year}
            </Typography>
          </Grid>

          {/* <Grid size={{ xs: 6, md: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Income
            </Typography>

            <Typography sx={{ fontWeight: 600 }}>{formatCurrency(ledger.totalIncome)}</Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Expense
            </Typography>

            <Typography sx={{ fontWeight: 600 }}>{formatCurrency(ledger.totalExpense)}</Typography>
          </Grid> */}
        </Grid>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Opening Balance
                </Typography>

                <BalanceItem label="Cash In Hand" value={ledger.openingBalance.cashInHand} />

                <BalanceItem label="Bank Balance" value={ledger.openingBalance.bankBalance} />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Closing Balance
                </Typography>

                <BalanceItem label="Cash In Hand" value={ledger.closingBalance.cashInHand} />

                <BalanceItem label="Bank Balance" value={ledger.closingBalance.bankBalance} />
              </Stack>
            </Grid>
          </Grid>

          <Divider />

          <LedgerTable entries={ledger.entries} />

          {/*<Divider />

             <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <BalanceItem label="Total Income" value={ledger.totalIncome} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <BalanceItem label="Total Expense" value={ledger.totalExpense} />
            </Grid>
          </Grid> */}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
