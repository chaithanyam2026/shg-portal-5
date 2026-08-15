"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
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

import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

import { SPECIAL_LOAN_TYPE } from "@/features/loans/domain/loan-type";

import type { LoanRegister, LoanRegisterGroup, LoanRegisterTotals } from "../domain/loan-register";

type Props = {
  register: LoanRegister;
};

type SummaryCardProps = {
  label: string;
  value: string;
};

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>

        <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
      </Stack>
    </Paper>
  );
}

function TotalsRow({
  label,
  totals,
  showExpiryDate,
}: {
  label: string;
  totals: LoanRegisterTotals;
  showExpiryDate: boolean;
}) {
  return (
    <TableRow
      sx={{
        "& td": {
          fontWeight: 700,
          borderTop: 2,
          borderColor: "divider",
        },
      }}
    >
      <TableCell colSpan={showExpiryDate ? 4 : 3}>{label}</TableCell>
      <TableCell align="right">{formatCurrency(totals.disbursedAmount)}</TableCell>
      <TableCell align="right">{formatCurrency(totals.paidPrincipal)}</TableCell>
      <TableCell align="right">{formatCurrency(totals.paidInterest)}</TableCell>
      <TableCell align="right">{formatCurrency(totals.paidLoanFine)}</TableCell>
      <TableCell align="right">{formatCurrency(totals.outstandingPrincipal)}</TableCell>
      <TableCell align="right">{formatCurrency(totals.pendingInterest)}</TableCell>
      <TableCell align="right">{formatCurrency(totals.pendingLoanFine)}</TableCell>
      <TableCell align="right">{formatCurrency(totals.totalOutstanding)}</TableCell>
      <TableCell />
    </TableRow>
  );
}

function RegisterGroupSection({
  group,
  defaultExpanded,
}: {
  group: LoanRegisterGroup;
  defaultExpanded: boolean;
}) {
  const showExpiryDate = group.loanType === SPECIAL_LOAN_TYPE;

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
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
        <Stack
          direction="row"
          sx={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            pr: 1,
          }}
        >
          <Stack spacing={0.5}>
            <Typography sx={{ fontWeight: 700 }}>{group.label}</Typography>

            <Typography variant="body2" color="text.secondary">
              {group.totals.count} loan{group.totals.count === 1 ? "" : "s"}
            </Typography>
          </Stack>

          <Stack spacing={0.5} sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Typography variant="body2" color="text.secondary">
              Total Outstanding
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {formatCurrency(group.totals.totalOutstanding)}
            </Typography>
          </Stack>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0 }}>
        <TableContainer
          sx={{
            overflowX: "auto",
          }}
        >
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell>Loan No</TableCell>
                <TableCell>Member</TableCell>
                <TableCell>Disbursed</TableCell>
                {showExpiryDate && <TableCell>Expiry</TableCell>}
                <TableCell align="right">Disbursed Amt</TableCell>
                <TableCell align="right">Paid Principal</TableCell>
                <TableCell align="right">Paid Interest</TableCell>
                <TableCell align="right">Paid Fine</TableCell>
                <TableCell align="right">Outstanding</TableCell>
                <TableCell align="right">Pending Interest</TableCell>
                <TableCell align="right">Pending Fine</TableCell>
                <TableCell align="right">Total Due</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {group.rows.map((row) => (
                <TableRow key={row.loanId} hover>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Link href={`/loans/${row.loanId}`} style={{ textDecoration: "none" }}>
                      {row.loanNumber}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="body2">{row.memberName}</Typography>

                      <Typography variant="caption" color="text.secondary">
                        {row.memberCode}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(row.disbursedDate)}</TableCell>

                  {showExpiryDate && (
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {row.expiryDate ? formatDate(row.expiryDate) : "-"}
                    </TableCell>
                  )}

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {formatCurrency(row.disbursedAmount)}
                  </TableCell>

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {formatCurrency(row.paidPrincipal)}
                  </TableCell>

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {formatCurrency(row.paidInterest)}
                  </TableCell>

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {formatCurrency(row.paidLoanFine)}
                  </TableCell>

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {formatCurrency(row.outstandingPrincipal)}
                  </TableCell>

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {formatCurrency(row.pendingInterest)}
                  </TableCell>

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {formatCurrency(row.pendingLoanFine)}
                  </TableCell>

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {formatCurrency(row.totalOutstanding)}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === "ACTIVE" ? "success" : "default"}
                    />
                  </TableCell>
                </TableRow>
              ))}

              <TotalsRow
                label={`${group.label} Total`}
                totals={group.totals}
                showExpiryDate={showExpiryDate}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}

export default function LoanRegisterTable({ register }: Props) {
  const activeCount = register.groups.reduce(
    (count, group) => count + group.rows.filter((row) => row.status === "ACTIVE").length,
    0,
  );

  if (register.groups.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary" align="center">
          No loans found for this financial year.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard label="Total Loans" value={String(register.totals.count)} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard label="Active Loans" value={String(activeCount)} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard label="Total Disbursed" value={formatCurrency(register.totals.disbursedAmount)} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            label="Total Outstanding"
            value={formatCurrency(register.totals.totalOutstanding)}
          />
        </Grid>
      </Grid>

      <Stack spacing={1}>
        {register.groups.map((group, index) => (
          <RegisterGroupSection key={group.loanType} group={group} defaultExpanded={index === 0} />
        ))}
      </Stack>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>Grand Total</Typography>

          <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
            <Stack spacing={0.25}>
              <Typography variant="caption" color="text.secondary">
                Disbursed
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                {formatCurrency(register.totals.disbursedAmount)}
              </Typography>
            </Stack>

            <Stack spacing={0.25}>
              <Typography variant="caption" color="text.secondary">
                Outstanding
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                {formatCurrency(register.totals.totalOutstanding)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
