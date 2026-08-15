"use client";

import { useEffect, useRef, useState } from "react";

import { FormControlLabel, Stack, Switch, TextField } from "@mui/material";

import { getMinimumMonthlyRepayment } from "../domain/minimum-monthly-repayment";

type Props = {
  disbursedAmount: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  helperText?: string;
};

export default function MinimumMonthlyRepaymentField({
  disbursedAmount,
  value,
  onChange,
  disabled = false,
  helperText,
}: Props) {
  const suggested = getMinimumMonthlyRepayment(disbursedAmount);
  const [override, setOverride] = useState(() => value !== 0 && value !== suggested);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!override && value !== suggested) {
      onChangeRef.current(suggested);
    }
  }, [override, suggested, value]);

  return (
    <Stack spacing={0.5} sx={{ width: "100%" }}>
      <TextField
        label="Minimum Monthly Repayment"
        type="number"
        fullWidth
        required
        disabled={disabled}
        slotProps={{
          htmlInput: {
            readOnly: !override,
          },
        }}
        value={override ? value : suggested}
        helperText={
          suggested > 0
            ? `Suggested from disbursed amount: ₹${suggested.toLocaleString("en-IN")}${helperText ? `. ${helperText}` : ""}`
            : `No minimum is required for this disbursed amount.${helperText ? ` ${helperText}` : ""}`
        }
        onChange={(event) => onChange(Number(event.target.value))}
      />

      <FormControlLabel
        disabled={disabled}
        control={
          <Switch
            checked={override}
            onChange={(event) => {
              const nextOverride = event.target.checked;
              setOverride(nextOverride);

              if (!nextOverride) {
                onChange(suggested);
              }
            }}
          />
        }
        label="Override suggested amount"
      />
    </Stack>
  );
}
