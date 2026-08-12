import { Card, CardContent, Divider, Grid, Stack, Typography } from "@mui/material";

import { formatDate } from "@/lib/utils/date";
import type { LoanDetails } from "../../types";

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

export default function GeneralTab({ loan }: Props) {
  return (
    <Card elevation={0}>
      <CardContent>
        <Grid container spacing={3}>
          <Row label="Loan Number" value={loan.loanNumber} />

          <Row label="Status" value={loan.status} />

          <Row label="Member" value={`${loan.memberCode} - ${loan.memberName}`} />

          <Row label="Loan Type" value={loan.loanType} />

          <Row label="Sanctioned Amount" value={`₹${loan.sanctionedAmount.toLocaleString()}`} />

          <Row
            label="Disbursed Amount"
            value={`formatCurrency(
  loan.disbursedAmount,
)`}
          />

          <Row label="Interest Rate" value={`${loan.interestRate}%`} />

          <Row
            label="Minimum Monthly Repayment"
            value={`₹${loan.expectedMonthlyRepayment.toLocaleString()}`}
          />

          <Row label="Disbursed Date" value={formatDate(loan.disbursedDate)} />

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
