import type { ChipProps } from "@mui/material";

import type { LoanStatus } from "../domain";

export function getLoanStatusChipColor(status: LoanStatus): ChipProps["color"] {
  switch (status) {
    case "ACTIVE":
      return "success";

    case "CLOSED":
      return "default";

    default:
      return "default";
  }
}
