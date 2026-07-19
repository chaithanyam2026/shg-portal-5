"use client";

import { ChangeEvent } from "react";

import { Stack, TextField } from "@mui/material";

import type { CreateFinancialYearDraft } from "../types";

type Props = {
  value: CreateFinancialYearDraft;

  onChange: (value: CreateFinancialYearDraft) => void;
};

export default function FinancialYearDetailsStep({ value, onChange }: Props) {
  function update(field: keyof CreateFinancialYearDraft) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...value,
        [field]: event.target.value,
      });
    };
  }

  return (
    <Stack spacing={3}>
      <TextField
        label="Financial Year Name"
        value={value.name}
        onChange={update("name")}
        fullWidth
        required
      />

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
      >
        <TextField
          label="Start Date"
          type="date"
          value={value.startDate}
          onChange={update("startDate")}
          fullWidth
          required
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          label="End Date"
          type="date"
          value={value.endDate}
          onChange={update("endDate")}
          fullWidth
          required
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </Stack>

      <TextField
        label="Remarks"
        value={value.remarks}
        onChange={update("remarks")}
        multiline
        minRows={3}
        fullWidth
      />
    </Stack>
  );
}
