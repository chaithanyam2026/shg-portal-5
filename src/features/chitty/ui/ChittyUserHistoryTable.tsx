"use client";

import {
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { formatCurrency, formatDate } from "@/lib/utils/format";

import type { ChittyUserHistory } from "../types";

type Props = {
  history: ChittyUserHistory;
  disabled?: boolean;
  onWinDateChange(chittyUserId: string, winDate: string | null): void;
};

const stickyName = {
  position: "sticky",
  left: 0,
  zIndex: 1,
  bgcolor: "background.paper",
  minWidth: 200,
};

export default function ChittyUserHistoryTable({
  history,
  disabled = false,
  onWinDateChange,
}: Props) {
  if (history.groups.length === 0) {
    return <Typography color="text.secondary">No chitty users for this selection.</Typography>;
  }

  return (
    <Stack spacing={3}>
      {history.groups.map((group) => (
        <Stack key={group.agentMemberId} spacing={1}>
          <Typography variant="h6">{group.agentMemberName}</Typography>
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...stickyName, zIndex: 3 }}>Chitty user name</TableCell>
                  {history.dates.map((date) => (
                    <TableCell key={date} align="right" sx={{ whiteSpace: "nowrap" }}>
                      {formatDate(date)}
                    </TableCell>
                  ))}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Chitty win date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {group.users.map((user) => (
                  <TableRow key={user.chittyUserId}>
                    <TableCell sx={stickyName}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <span>{user.userName}</span>
                        {user.pendingCount > 0 && (
                          <Chip
                            size="small"
                            color="warning"
                            label={`Pending ${user.pendingCount}`}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    {user.payments.map((payment) => (
                      <TableCell key={payment.date} align="right" sx={{ whiteSpace: "nowrap" }}>
                        {payment.amount === null ? "-" : formatCurrency(payment.amount)}
                      </TableCell>
                    ))}
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {history.canRecordWin ? (
                        <TextField
                          type="date"
                          size="small"
                          value={user.winDate ?? ""}
                          disabled={disabled}
                          onChange={(event) =>
                            onWinDateChange(user.chittyUserId, event.target.value || null)
                          }
                        />
                      ) : user.winDate ? (
                        formatDate(user.winDate)
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      ))}
    </Stack>
  );
}
