import { TableCell, TableRow } from "@mui/material";

import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

import type { LedgerEntry } from "../domain/ledger-entry";

type Props = {
  entry: LedgerEntry;
};

export function LedgerRow({
  entry,
}: Props) {
  return (
    <TableRow hover>
      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {formatDate(entry.date)}
      </TableCell>

      <TableCell>
        {entry.description}
      </TableCell>

      <TableCell
        align="right"
        sx={{ whiteSpace: "nowrap" }}
      >
        {entry.income > 0
          ? formatCurrency(entry.income)
          : "-"}
      </TableCell>

      <TableCell
        align="right"
        sx={{ whiteSpace: "nowrap" }}
      >
        {entry.expense > 0
          ? formatCurrency(entry.expense)
          : "-"}
      </TableCell>

      <TableCell
        align="right"
        sx={{ whiteSpace: "nowrap" }}
      >
        {formatCurrency(entry.cashInHand)}
      </TableCell>

      <TableCell
        align="right"
        sx={{ whiteSpace: "nowrap" }}
      >
        {formatCurrency(entry.bankBalance)}
      </TableCell>
    </TableRow>
  );
}