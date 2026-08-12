"use client";

import { Chip } from "@mui/material";

import type { FinancialYearStatus } from "@/models/FinancialYear";

type Props = {
  status: FinancialYearStatus;
};

export default function FinancialYearStatusChip({ status }: Props) {
  const color = (() => {
    switch (status) {
      case "DRAFT":
        return "default";

      case "IN_PROGRESS":
        return "primary";

      case "VALIDATED":
        return "warning";

      case "APPROVED":
        return "success";

      case "CLOSED":
        return "error";

      default:
        return "default";
    }
  })();

  return <Chip label={status.replace("_", " ")} color={color} variant="filled" />;
}
