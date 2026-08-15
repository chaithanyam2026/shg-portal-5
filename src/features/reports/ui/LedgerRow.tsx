import { TableCell, TableRow } from "@mui/material";

import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

import type { LedgerEntry } from "../domain/ledger-entry";

type Props = {
  entry: LedgerEntry;
};

export function LedgerRow({ entry }: Props) {
  const incomeAmount = entry.displayIncome ?? entry.income;

  return (
    <TableRow hover sx={entry.isSummary ? { backgroundColor: "action.hover" } : undefined}>
      <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(entry.date)}</TableCell>

      <TableCell sx={entry.isSummary ? { fontWeight: 600 } : undefined}>{entry.description}</TableCell>

      <TableCell align="right" sx={{ whiteSpace: "nowrap", fontWeight: entry.isSummary ? 600 : undefined }}>
        {incomeAmount > 0 ? formatCurrency(incomeAmount) : "-"}
      </TableCell>

      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
        {entry.expense > 0 ? formatCurrency(entry.expense) : "-"}
      </TableCell>

      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
        {formatCurrency(entry.cashInHand)}
      </TableCell>

      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
        {formatCurrency(entry.bankBalance)}
      </TableCell>
    </TableRow>
  );
}
