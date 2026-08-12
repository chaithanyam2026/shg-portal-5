"use client";

import { TableCell, TableRow, TextField } from "@mui/material";

import type { PaymentRecord } from "../types";

type Props = {
  record: PaymentRecord;
  disabled?: boolean;
  onChange(record: PaymentRecord): void;
};

export default function PaymentRow({ record, disabled = false, onChange }: Props) {
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
      <TableCell>{record.memberCode}</TableCell>

      <TableCell>{record.memberName}</TableCell>

      <TableCell width={120}>
        <TextField
          fullWidth
          size="small"
          type="number"
          disabled={disabled}
          value={record.contribution}
          slotProps={{
            input: {
              inputProps: {
                min: 0,
              },
            },
          }}
          onChange={(event) => update("contribution", Number(event.target.value))}
        />
      </TableCell>

      <TableCell width={120}>
        <TextField
          fullWidth
          size="small"
          type="number"
          disabled={disabled}
          value={record.loanRepayment}
          onChange={(event) => update("loanRepayment", Number(event.target.value))}
        />
      </TableCell>

      <TableCell width={120}>
        <TextField
          fullWidth
          size="small"
          type="number"
          disabled={disabled}
          value={record.absentFine}
          onChange={(event) => update("absentFine", Number(event.target.value))}
        />
      </TableCell>

      <TableCell width={150}>
        <TextField
          fullWidth
          size="small"
          type="number"
          disabled={disabled}
          value={record.specialLoanFine}
          onChange={(event) => update("specialLoanFine", Number(event.target.value))}
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
