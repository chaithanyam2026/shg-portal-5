"use client";

import { TextField, type TextFieldProps } from "@mui/material";
import { useState } from "react";

type Props = Omit<TextFieldProps, "type" | "value" | "onChange"> & {
  value: number;
  integer?: boolean;
  onChange: (value: number) => void;
};

export default function NumberField({
  value,
  integer = false,
  onChange,
  onFocus,
  onBlur,
  sx,
  ...props
}: Props) {
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <TextField
      {...props}
      type="number"
      sx={[
        {
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
          "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
            {
              WebkitAppearance: "none",
              margin: 0,
            },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      value={showEmpty ? "" : value}
      onFocus={(event) => {
        if (value === 0) {
          setShowEmpty(true);
        }

        onFocus?.(event);
      }}
      onBlur={(event) => {
        setShowEmpty(false);
        onBlur?.(event);
      }}
      onChange={(event) => {
        const next = event.target.value;

        if (next === "") {
          setShowEmpty(true);
          onChange(0);
          return;
        }

        setShowEmpty(false);
        const parsed = integer ? Number.parseInt(next, 10) : Number(next);
        onChange(Number.isNaN(parsed) ? 0 : parsed);
      }}
    />
  );
}
