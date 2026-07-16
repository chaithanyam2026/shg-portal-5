"use client";

import {
  useMemo,
} from "react";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import type {
  FinancialYearOption,
} from "../domain/financial-year-option";

type Props = {
  options: FinancialYearOption[];

  value: string;

  onChange: (
    financialYearId: string,
  ) => void;
};

export default function FinancialYearSelector({
  options,
  value,
  onChange,
}: Props) {
  const selected =
    useMemo(
      () =>
        options.find(
          (option) =>
            option.id === value,
        ),
      [options, value],
    );

  return (
    <Stack
      spacing={1}
      sx={{
        minWidth: 260,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        Financial Year
      </Typography>

      <FormControl
        fullWidth
        size="small"
      >
        <InputLabel>
          Financial Year
        </InputLabel>

        <Select
          label="Financial Year"
          value={value}
          onChange={(
            event,
          ) =>
            onChange(
              event.target.value,
            )
          }
        >
          {options.map(
            (option) => (
              <MenuItem
                key={option.id}
                value={
                  option.id
                }
              >
                {option.name}

                {option.status ===
                  "IN_PROGRESS" &&
                  " (In Progress)"}

                {option.status ===
                  "CLOSED" &&
                  " (Closed)"}

                {option.status ===
                  "APPROVED" &&
                  " (Approved)"}

                {option.status ===
                  "VALIDATED" &&
                  " (Validated)"}

                {option.status ===
                  "DRAFT" &&
                  " (Draft)"}
              </MenuItem>
            ),
          )}
        </Select>
      </FormControl>

      {selected && (
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Current Selection :{" "}
          {selected.name}
        </Typography>
      )}
    </Stack>
  );
}