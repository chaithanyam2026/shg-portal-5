"use client";

import { useEffect, useState } from "react";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, TextField } from "@mui/material";

type Props = {
  value: string;
  disabled?: boolean;
  onChange(value: string): void;
};

function toIsoDate(value: string): string {
  return value.slice(0, 10);
}

function toDisplay(value: string): string {
  const match = toIsoDate(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return "";
  }

  return `${match[3]}/${match[2]}/${match[1].slice(2)}`;
}

function toIso(display: string, currentValue: string): string | null {
  const match = display.trim().match(/^(\d{2})\/(\d{2})\/(\d{2})$/);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const shortYear = Number(match[3]);
  const currentYear = Number(toIsoDate(currentValue).slice(0, 4));
  const year =
    Number.isInteger(currentYear) && currentYear % 100 === shortYear
      ? currentYear
      : 2000 + shortYear;
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return `${year}-${match[2]}-${match[1]}`;
}

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 6);

  return [day, month, year].filter((part) => part.length > 0).join("/");
}

export default function ShortDateField({ value, disabled = false, onChange }: Props) {
  const [text, setText] = useState(() => toDisplay(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setText(toDisplay(value));
    }
  }, [focused, value]);

  function commit(nextText: string) {
    const iso = toIso(nextText, value);

    if (!iso) {
      return;
    }

    if (iso !== toIsoDate(value)) {
      onChange(iso);
    }

    setText(toDisplay(iso));
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, width: 132 }}>
      <TextField
        size="small"
        disabled={disabled}
        value={text}
        placeholder="DD/MM/YY"
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          const iso = toIso(text, value);
          setText(iso ? toDisplay(iso) : toDisplay(value));
        }}
        onChange={(event) => {
          const next = maskDate(event.target.value);
          setText(next);
          commit(next);
        }}
        slotProps={{
          htmlInput: {
            inputMode: "numeric",
            maxLength: 8,
            "aria-label": "Date",
            autoComplete: "off",
          },
        }}
        sx={{ width: 96 }}
      />

      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          color: disabled ? "action.disabled" : "action.active",
        }}
      >
        <CalendarMonthIcon fontSize="small" />
        <Box
          component="input"
          type="date"
          disabled={disabled}
          value={toIsoDate(value)}
          aria-label="Choose date"
          onChange={(event) => {
            if (event.target.value) {
              onChange(event.target.value);
              setText(toDisplay(event.target.value));
            }
          }}
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            cursor: disabled ? "default" : "pointer",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    </Box>
  );
}
