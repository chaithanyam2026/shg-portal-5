"use client";

import { TableCell, TableRow, TextField } from "@mui/material";

import type { PaymentRecord } from "../types";

import AmountField from "./AmountField";

type Props = {
  serialNumber: number;
  record: PaymentRecord;
  disabled?: boolean;
  onChange(record: PaymentRecord): void;
};

export default function PaymentRow({ serialNumber, record, disabled = false, onChange }: Props) {
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

      <TableCell width={120}>
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
      </TableCell>

      <TableCell width={120}>
        <AmountField
          fullWidth
          size="small"
          disabled={disabled}
          value={record.loanRepayment}
          onChange={(value) => update("loanRepayment", value)}
        />
      </TableCell>

      <TableCell width={120}>
        <AmountField
          fullWidth
          size="small"
          disabled={disabled}
          value={record.absentFine}
          onChange={(value) => update("absentFine", value)}
        />
      </TableCell>

      <TableCell width={150}>
        <AmountField
          fullWidth
          size="small"
          disabled={disabled}
          value={record.specialLoanFine}
          onChange={(value) => update("specialLoanFine", value)}
        />
      </TableCell>

      <TableCell width={120}>{record.total}</TableCell>

      <TableCell>
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
