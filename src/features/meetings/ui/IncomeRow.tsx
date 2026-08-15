"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, MenuItem, TableCell, TableRow, TextField } from "@mui/material";

import { INCOME_CATEGORY_OPTIONS } from "../domain/income";

import type { IncomeRecord } from "../types";

import AmountField from "./AmountField";

type Props = {
  record: IncomeRecord;
  disabled?: boolean;
  onChange(record: IncomeRecord): void;
  onDelete(): void;
};

export default function IncomeRow({ record, disabled = false, onChange, onDelete }: Props) {
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
          value={record.category}
          onChange={(event) =>
            onChange({
              ...record,
              category: event.target.value as typeof record.category,
            })
          }
        >
          {INCOME_CATEGORY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>

      <TableCell width={140}>
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
