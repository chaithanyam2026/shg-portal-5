"use client";

import { IconButton, MenuItem, TableCell, TableRow, TextField } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { BANK_TRANSACTION_TYPE_OPTIONS } from "../domain/bank-transaction";

import type { BankTransactionRecord } from "../types";

type Props = {
  record: BankTransactionRecord;
  disabled?: boolean;
  onChange(record: BankTransactionRecord): void;
  onDelete(): void;
};

export default function BankTransactionRow({
  record,
  disabled = false,
  onChange,
  onDelete,
}: Props) {
  return (
    <TableRow hover>
      <TableCell width={160}>
        <TextField
          fullWidth
          size="small"
          type="date"
          disabled={disabled}
          value={record.transactionDate.slice(0, 10)}
          onChange={(event) =>
            onChange({
              ...record,
              transactionDate: event.target.value,
            })
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </TableCell>

      <TableCell width={220}>
        <TextField
          select
          fullWidth
          size="small"
          disabled={disabled}
          value={record.type}
          onChange={(event) =>
            onChange({
              ...record,
              type: event.target.value as typeof record.type,
            })
          }
        >
          {BANK_TRANSACTION_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>

      <TableCell width={140}>
        <TextField
          fullWidth
          size="small"
          type="number"
          disabled={disabled}
          value={record.amount}
          onChange={(event) =>
            onChange({
              ...record,
              amount: Number(event.target.value),
            })
          }
          slotProps={{
            htmlInput: {
              min: 0,
            },
          }}
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          disabled={disabled}
          value={record.remarks}
          onChange={(event) =>
            onChange({
              ...record,
              remarks: event.target.value,
            })
          }
        />
      </TableCell>

      <TableCell width={70}>
        <IconButton color="error" disabled={disabled} onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
