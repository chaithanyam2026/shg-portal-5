"use client";

import { Alert } from "@mui/material";

import { VALIDATION_SEVERITY } from "../domain/summary";

import type { SummaryValidation } from "../types";

type Props = {
  validation: SummaryValidation;
};

export default function ValidationItem({ validation }: Props) {
  const severity =
    validation.severity === VALIDATION_SEVERITY.SUCCESS
      ? "success"
      : validation.severity === VALIDATION_SEVERITY.WARNING
        ? "warning"
        : "error";

  return (
    <Alert severity={severity}>
      <strong>{validation.title}</strong>

      {" — "}

      {validation.message}
    </Alert>
  );
}
