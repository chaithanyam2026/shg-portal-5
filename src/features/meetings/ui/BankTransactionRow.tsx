"use client";

import { IconButton, MenuItem, TableCell, TableRow, TextField } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { BANK_TRANSACTION_TYPE_OPTIONS } from "../domain/bank-transaction";

import type { BankTransactionRecord } from "../types";

import AmountField from "./AmountField";
import ShortDateField from "./ShortDateField";

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
      <TableCell sx={{ verticalAlign: "top" }}>
        <ShortDateField
          disabled={disabled}
          value={record.transactionDate}
          onChange={(transactionDate) =>
            onChange({
              ...record,
              transactionDate,
            })
          }
        />
      </TableCell>

      <TableCell sx={{ verticalAlign: "top" }}>
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

      <TableCell sx={{ verticalAlign: "top" }}>
        <AmountField
          fullWidth
          size="small"
          disabled={disabled}
          value={record.amount}
          onChange={(amount) =>
            onChange({
              ...record,
              amount,
            })
          }
          slotProps={{
            htmlInput: {
              min: 0,
            },
          }}
        />
      </TableCell>

      <TableCell sx={{ verticalAlign: "top" }}>
        <TextField
          fullWidth
          multiline
          minRows={2}
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

      <TableCell sx={{ verticalAlign: "top" }}>
        <IconButton color="error" disabled={disabled} onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
