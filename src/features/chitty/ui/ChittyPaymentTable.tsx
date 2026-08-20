"use client";

import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import { formatCurrency } from "@/lib/utils/format";

import { canEditChittyPaymentRow } from "../domain";
import type { ChittyPaymentRecord } from "../types";

import NumberField from "./NumberField";

type Props = {
  records: ChittyPaymentRecord[];
  canEditAll: boolean;
  currentMemberId: string | null;
  sheetLocked?: boolean;
  disabled?: boolean;
  onChange(records: ChittyPaymentRecord[]): void;
};

export default function ChittyPaymentTable({
  records,
  canEditAll,
  currentMemberId,
  sheetLocked = false,
  disabled = false,
  onChange,
}: Props) {
  const totals = records.reduce(
    (sum, record) => ({
      cash: sum.cash + record.cash,
      gpay: sum.gpay + record.gpay,
      gpayChecked: sum.gpayChecked + (record.gpayChecked ? record.gpay : 0),
      missingCount: sum.missingCount + record.missingCount,
    }),
    { cash: 0, gpay: 0, gpayChecked: 0, missingCount: 0 },
  );

  function updateRecord(index: number, patch: Partial<ChittyPaymentRecord>) {
    const next = [...records];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Member</TableCell>
            <TableCell width={140}>Cash Payment</TableCell>
            <TableCell width={140}>GPay Payment</TableCell>
            <TableCell width={88} align="center">
              GPay
            </TableCell>
            <TableCell width={120}>Missing count</TableCell>
            <TableCell sx={{ minWidth: 180 }}>Remarks</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No members found.
              </TableCell>
            </TableRow>
          )}

          {records.map((record, index) => {
            const rowDisabled =
              disabled ||
              !canEditChittyPaymentRow({
                sheetLocked,
                canEditAll,
                currentMemberId,
                rowMemberId: record.memberId,
              });

            return (
              <TableRow key={record.memberId} hover>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{record.memberName}</TableCell>

                <TableCell>
                  <NumberField
                    fullWidth
                    size="small"
                    disabled={rowDisabled}
                    value={record.cash}
                    slotProps={{
                      input: {
                        inputProps: {
                          min: 0,
                        },
                      },
                    }}
                    onChange={(value) => updateRecord(index, { cash: Math.max(0, value) })}
                  />
                </TableCell>

                <TableCell>
                  <NumberField
                    fullWidth
                    size="small"
                    disabled={rowDisabled}
                    value={record.gpay}
                    slotProps={{
                      input: {
                        inputProps: {
                          min: 0,
                        },
                      },
                    }}
                    onChange={(value) => updateRecord(index, { gpay: Math.max(0, value) })}
                  />
                </TableCell>

                <TableCell align="center">
                  <Checkbox
                    checked={record.gpayChecked}
                    disabled={rowDisabled}
                    onChange={(event) => updateRecord(index, { gpayChecked: event.target.checked })}
                    slotProps={{
                      input: {
                        "aria-label": `Include ${record.memberName} GPay in total`,
                      },
                    }}
                  />
                </TableCell>

                <TableCell>
                  <NumberField
                    fullWidth
                    size="small"
                    integer
                    disabled={rowDisabled}
                    value={record.missingCount}
                    slotProps={{
                      input: {
                        inputProps: {
                          min: 0,
                          step: 1,
                        },
                      },
                    }}
                    onChange={(value) => updateRecord(index, { missingCount: Math.max(0, value) })}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    minRows={1}
                    maxRows={3}
                    disabled={rowDisabled}
                    value={record.remarks}
                    onChange={(event) => updateRecord(index, { remarks: event.target.value })}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(totals.cash)}</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(totals.gpay)}</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              {formatCurrency(totals.gpayChecked)}
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }}>{totals.missingCount}</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
