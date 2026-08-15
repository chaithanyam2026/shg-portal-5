"use client";

import {
  Card,
  CardContent,
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

import type { MemberTransactionsSummary } from "../types";

type Props = {
  summary: MemberTransactionsSummary;
};

function formatAmount(value: number): string {
  return value > 0 ? formatCurrency(value) : "—";
}

export default function MemberTransactionsView({ summary }: Props) {
  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h6">Meeting Collection</Typography>

            <Typography sx={{ fontWeight: 700 }}>{formatCurrency(summary.grandTotal)}</Typography>
          </Stack>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell align="right">Contribution</TableCell>
              <TableCell align="right">Loan</TableCell>
              <TableCell align="right">Absent Fine</TableCell>
              <TableCell align="right">Special Loan</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {summary.records.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No members found.
                </TableCell>
              </TableRow>
            )}

            {summary.records.map((record) => (
              <TableRow key={record.memberId}>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {record.memberCode}
                  </Typography>

                  <Typography variant="body2">{record.memberName}</Typography>
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {formatAmount(record.contribution)}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {formatAmount(record.loanRepayment)}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {formatAmount(record.absentFine)}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {formatAmount(record.specialLoanFine)}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                  {formatAmount(record.total)}
                </TableCell>
              </TableRow>
            ))}

            {summary.records.length > 0 && (
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>

                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  {formatCurrency(summary.totalContribution)}
                </TableCell>

                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  {formatCurrency(summary.totalLoanRepayment)}
                </TableCell>

                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  {formatCurrency(summary.totalAbsentFine)}
                </TableCell>

                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  {formatCurrency(summary.totalSpecialLoanFine)}
                </TableCell>

                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  {formatCurrency(summary.grandTotal)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
