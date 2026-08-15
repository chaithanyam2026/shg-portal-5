import { Card, CardContent, Divider, Grid, Stack, Typography } from "@mui/material";

import { formatDate } from "@/lib/utils/date";
import type { LoanDetails } from "../../types";
import { formatCurrency } from "../format";

type Props = {
  loan: LoanDetails;
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>

        <Typography variant="body1">{value}</Typography>
      </Stack>
    </Grid>
  );
}

function formatEffectiveRate(value: number): string {
  return `${value.toFixed(2)}% p.a.`;
}

export default function GeneralTab({ loan }: Props) {
  const fineWaiverAmountLabel = !loan.fineWaiver.isEligible
    ? "Not applicable"
    : loan.fineWaiver.isWaived
      ? formatCurrency(0)
      : formatCurrency(loan.fineWaiver.amountToPay);

  return (
    <Card elevation={0}>
      <CardContent>
        <Grid container spacing={3}>
          <Row label="Loan Number" value={loan.loanNumber} />

          <Row label="Status" value={loan.status} />

          <Row label="Member" value={`${loan.memberCode} - ${loan.memberName}`} />

          <Row label="Loan Type" value={loan.loanType} />

          <Row label="Sanctioned Amount" value={formatCurrency(loan.sanctionedAmount)} />

          <Row label="Sanctioned Date" value={formatDate(loan.sanctionedDate)} />

          <Row label="Nominal Interest Rate" value={`${loan.interestRate}%`} />

          <Row
            label="Minimum Monthly Repayment"
            value={formatCurrency(loan.expectedMonthlyRepayment)}
          />

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Disbursement & Effective Cost
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Effective rates are on the disbursed amount (non-diminishing) and include accrued
              interest up to the financial year end date.
            </Typography>
          </Grid>

          <Row label="Disbursed Amount" value={formatCurrency(loan.disbursedAmount)} />

          <Row label="Start Date" value={formatDate(loan.disbursedDate)} />

          <Row
            label="Expiry Date"
            value={loan.expiryDate ? formatDate(loan.expiryDate) : "Not applicable"}
          />

          <Row
            label="Effective Interest (Interest Only)"
            value={formatEffectiveRate(loan.effectiveInterestPercentage)}
          />

          <Row
            label="Effective Interest (Interest + Loan Fines)"
            value={formatEffectiveRate(loan.effectiveInterestWithFinesPercentage)}
          />

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Current Balances
            </Typography>
          </Grid>

          <Row label="Current Outstanding" value={formatCurrency(loan.outstandingPrincipal)} />

          <Row label="Pending Interest" value={formatCurrency(loan.pendingInterest)} />

          <Row label="Pending Loan Fines" value={formatCurrency(loan.pendingLoanFine)} />

          <Row label="Total Payable" value={formatCurrency(loan.totalPayable)} />

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Monthly Fine Waiver
            </Typography>

            <Typography variant="caption" color="text.secondary">
              For {loan.fineWaiver.evaluationMonthLabel}. Checked on 1{" "}
              {loan.fineWaiver.checkpointMonthLabel}. Pay before month-end to waive the fine entry.
            </Typography>
          </Grid>

          <Row
            label={`Principal Paid (${loan.fineWaiver.evaluationMonthLabel})`}
            value={formatCurrency(loan.fineWaiver.principalPaidThisMonth)}
          />

          {loan.fineWaiver.isEligible && !loan.fineWaiver.isWaived && (
            <>
              {loan.fineWaiver.lastMonthFineCharged > 0 && (
                <Row
                  label={`Last Month Fine (posted 1 ${loan.fineWaiver.evaluationMonthLabel})`}
                  value={formatCurrency(loan.fineWaiver.lastMonthFineCharged)}
                />
              )}

              <Row
                label={`Pending Fine Still Due (${loan.fineWaiver.evaluationMonthLabel})`}
                value={formatCurrency(loan.fineWaiver.pendingFineShortfall)}
              />

              <Row
                label={`Minimum Principal Shortfall (${loan.fineWaiver.evaluationMonthLabel})`}
                value={formatCurrency(loan.fineWaiver.minimumPrincipalShortfall)}
              />
            </>
          )}

          <Row
            label={`Amount to Pay to Waive Fine (${loan.fineWaiver.evaluationMonthLabel})`}
            value={fineWaiverAmountLabel}
          />

          <Grid size={12}>
            <Typography variant="body2" color="text.secondary">
              {loan.fineWaiver.reason}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={12}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Remarks
              </Typography>

              <Typography variant="body1">{loan.remarks || "—"}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
