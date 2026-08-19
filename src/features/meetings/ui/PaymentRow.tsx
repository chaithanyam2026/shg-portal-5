"use client";

import { Stack, TableCell, TableRow, TextField, Typography } from "@mui/material";

import { formatCurrency } from "@/lib/utils/format";

import type { PaymentRecord } from "../types";

import AmountField from "./AmountField";
import PaymentBalanceHint from "./PaymentBalanceHint";

type Props = {
  serialNumber: number;
  record: PaymentRecord;
  disabled?: boolean;
  showSpecialLoan?: boolean;
  onChange(record: PaymentRecord): void;
};

export default function PaymentRow({
  serialNumber,
  record,
  disabled = false,
  showSpecialLoan = false,
  onChange,
}: Props) {
  function update<K extends keyof PaymentRecord>(key: K, value: PaymentRecord[K]) {
    const next = {
      ...record,
      [key]: value,
    };

    next.total = next.contribution + next.loanRepayment + next.absentFine + next.specialLoanFine;

    onChange(next);
  }

  return (
    <TableRow hover>
      <TableCell align="right">{serialNumber}</TableCell>

      <TableCell>{record.memberName}</TableCell>

      <TableCell width={150} sx={{ verticalAlign: "top" }}>
        <Stack spacing={0}>
          <AmountField
            fullWidth
            size="small"
            disabled={disabled}
            value={record.contribution}
            slotProps={{
              input: {
                inputProps: {
                  min: 0,
                },
              },
            }}
            onChange={(value) => update("contribution", value)}
          />
          <PaymentBalanceHint due={record.contributionDue} entered={record.contribution} />
        </Stack>
      </TableCell>

      <TableCell width={150} sx={{ verticalAlign: "top" }}>
        <Stack spacing={0}>
          <AmountField
            fullWidth
            size="small"
            disabled={disabled}
            value={record.loanRepayment}
            onChange={(value) => update("loanRepayment", value)}
          />
          {record.outstandingPrincipal > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {`Outstanding principal ${formatCurrency(record.outstandingPrincipal)}`}
            </Typography>
          )}
        </Stack>
      </TableCell>

      <TableCell width={150} sx={{ verticalAlign: "top" }}>
        <Stack spacing={0}>
          <AmountField
            fullWidth
            size="small"
            disabled={disabled}
            value={record.absentFine}
            onChange={(value) => update("absentFine", value)}
          />
          <PaymentBalanceHint due={record.absentFineDue} entered={record.absentFine} />
        </Stack>
      </TableCell>

      {showSpecialLoan && (
        <TableCell width={150} sx={{ verticalAlign: "top" }}>
          <AmountField
            fullWidth
            size="small"
            disabled={disabled || !record.hasSpecialLoan}
            value={record.specialLoanFine}
            onChange={(value) => update("specialLoanFine", value)}
          />
        </TableCell>
      )}

      <TableCell width={120} sx={{ verticalAlign: "top" }}>
        {record.total}
      </TableCell>

      <TableCell sx={{ verticalAlign: "top" }}>
        <TextField
          fullWidth
          size="small"
          disabled={disabled}
          value={record.remarks}
          onChange={(event) => update("remarks", event.target.value)}
        />
      </TableCell>
    </TableRow>
  );
}
