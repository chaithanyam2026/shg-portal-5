"use client";

import { Fragment } from "react";

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
  Typography,
} from "@mui/material";

import { formatCurrency } from "@/lib/utils/format";

import { canEditChittyPaymentRow, userPaymentAmount } from "../domain";
import type { ChittyPaymentRecord } from "../types";

import NumberField from "./NumberField";

type Props = {
  records: ChittyPaymentRecord[];
  weeklyAmount: number;
  isAuction: boolean;
  canEditAll: boolean;
  canEditSheet: boolean;
  currentMemberId: string | null;
  disabled?: boolean;
  onChange(records: ChittyPaymentRecord[]): void;
};

type MemberGroup = {
  agentMemberId: string;
  agentMemberName: string;
  records: ChittyPaymentRecord[];
};

function groupByMember(records: ChittyPaymentRecord[]): MemberGroup[] {
  const groups: MemberGroup[] = [];
  const indexByMember = new Map<string, number>();

  for (const record of records) {
    const existingIndex = indexByMember.get(record.agentMemberId);

    if (existingIndex === undefined) {
      indexByMember.set(record.agentMemberId, groups.length);
      groups.push({
        agentMemberId: record.agentMemberId,
        agentMemberName: record.agentMemberName,
        records: [record],
      });
      continue;
    }

    groups[existingIndex].records.push(record);
  }

  return groups;
}

function rowAmount(record: ChittyPaymentRecord, weeklyAmount: number): number {
  return userPaymentAmount(
    record.paid,
    weeklyAmount,
    record.pendingBalance,
    record.previousBalancePayment,
  );
}

export default function ChittyPaymentTable({
  records,
  weeklyAmount,
  isAuction,
  canEditAll,
  canEditSheet,
  currentMemberId,
  disabled = false,
  onChange,
}: Props) {
  const groups = groupByMember(records);
  const columnCount = isAuction ? 5 : 4;
  const grandTotal = records.reduce((sum, record) => sum + rowAmount(record, weeklyAmount), 0);

  function updateRecord(chittyUserId: string, patch: Partial<ChittyPaymentRecord>) {
    onChange(
      records.map((record) =>
        record.chittyUserId === chittyUserId ? { ...record, ...patch } : record,
      ),
    );
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Chitty user</TableCell>
            <TableCell width={88} align="center">
              Pay
            </TableCell>
            <TableCell width={180}>Prev balance payment</TableCell>
            {isAuction && <TableCell width={160}>Auction amount</TableCell>}
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={columnCount} align="center">
                No chitty users for this selection.
              </TableCell>
            </TableRow>
          )}
          {groups.map((group) => (
            <Fragment key={group.agentMemberId}>
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  sx={{ bgcolor: "action.hover", borderBottom: 0, py: 1.25 }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {group.agentMemberName}
                  </Typography>
                </TableCell>
              </TableRow>
              {group.records.map((record) => {
                const editable =
                  !disabled &&
                  canEditChittyPaymentRow({
                    canEditSheet,
                    canEditAll,
                    currentMemberId,
                    rowAgentMemberId: record.agentMemberId,
                  });
                const balanceOpen = record.pendingBalance > 0;

                return (
                  <TableRow key={record.chittyUserId}>
                    <TableCell sx={{ pl: 3 }}>{record.userName}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={record.paid}
                        disabled={!editable || weeklyAmount <= 0}
                        onChange={(_event, paid) => updateRecord(record.chittyUserId, { paid })}
                        slotProps={{
                          input: { "aria-label": `Pay weekly amount for ${record.userName}` },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <NumberField
                        size="small"
                        value={balanceOpen ? record.previousBalancePayment : 0}
                        disabled={!editable || !balanceOpen}
                        error={editable && balanceOpen}
                        helperText={
                          balanceOpen
                            ? `Pending ${formatCurrency(record.pendingBalance)}`
                            : undefined
                        }
                        onChange={(previousBalancePayment) =>
                          updateRecord(record.chittyUserId, {
                            previousBalancePayment: Math.min(
                              previousBalancePayment,
                              record.pendingBalance,
                            ),
                          })
                        }
                        slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                      />
                    </TableCell>
                    {isAuction && (
                      <TableCell>
                        <NumberField
                          size="small"
                          value={record.auctionAmount}
                          disabled={!editable}
                          onChange={(auctionAmount) =>
                            updateRecord(record.chittyUserId, { auctionAmount })
                          }
                          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                        />
                      </TableCell>
                    )}
                    <TableCell align="right">
                      {formatCurrency(rowAmount(record, weeklyAmount))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </Fragment>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columnCount - 1}>Full payment amount</TableCell>
            <TableCell align="right">{formatCurrency(grandTotal)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
