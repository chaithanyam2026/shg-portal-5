"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, MenuItem, TableCell, TableRow, TextField } from "@mui/material";

import { INCOME_CATEGORY_OPTIONS } from "../domain/income";

import type { IncomeRecord } from "../types";

import AmountField from "./AmountField";
import ShortDateField from "./ShortDateField";

type Props = {
  record: IncomeRecord;
  disabled?: boolean;
  onChange(record: IncomeRecord): void;
  onDelete(): void;
};

const compactCellSx = {
  verticalAlign: "top" as const,
  borderBottom: "none",
  pb: 0.5,
  px: 1,
};

export default function IncomeRow({ record, disabled = false, onChange, onDelete }: Props) {
  return (
    <>
      <TableRow hover>
        <TableCell sx={compactCellSx}>
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

        <TableCell sx={compactCellSx}>
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

        <TableCell sx={compactCellSx}>
          <IconButton color="error" disabled={disabled} onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow hover>
        <TableCell colSpan={3} sx={{ pt: 0, pb: 0.5, px: 1, borderBottom: "none" }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Category"
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
      </TableRow>

      <TableRow hover>
        <TableCell colSpan={3} sx={{ pt: 0, px: 1 }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            size="small"
            label="Remarks"
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
      </TableRow>
    </>
  );
}
