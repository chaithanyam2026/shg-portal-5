import {
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import type { LedgerEntry } from "../domain/ledger-entry";
import { LedgerRow } from "./LedgerRow";

type Props = {
  entries: LedgerEntry[];
};

const COLUMNS = [
  {
    key: "date",
    label: "Date",
    align: "left" as const,
    width: 120,
  },
  {
    key: "transaction",
    label: "Transaction",
    align: "left" as const,
    width: 260,
  },
  {
    key: "income",
    label: "Income",
    align: "right" as const,
    width: 140,
  },
  {
    key: "expense",
    label: "Expense",
    align: "right" as const,
    width: 140,
  },
  {
    key: "cash",
    label: "Cash In Hand",
    align: "right" as const,
    width: 160,
  },
  {
    key: "bank",
    label: "Bank Balance",
    align: "right" as const,
    width: 160,
  },
];

export function LedgerTable({
  entries,
}: Props) {
  if (entries.length === 0) {
    return (
      <Alert severity="info">
        No transactions found.
      </Alert>
    );
  }

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        overflowX: "auto",
      }}
    >
      <Table
        stickyHeader
        size="small"
        sx={{
          minWidth: 980,
        }}
      >
        <TableHead>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableCell
                key={column.key}
                align={column.align}
                sx={{
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  width: column.width,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {entries.map((entry, index) => (
            <LedgerRow
              key={`${entry.meetingId ?? "meeting"}-${entry.referenceId ?? "row"}-${index}`}
              entry={entry}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}