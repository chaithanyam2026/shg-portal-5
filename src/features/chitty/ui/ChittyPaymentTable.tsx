"use client";

import { Fragment } from "react";

import {
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

import { canEditChittyPaymentRow } from "../domain";
import type { ChittyPaymentRecord } from "../types";

import NumberField from "./NumberField";

type Props = {
  records: ChittyPaymentRecord[];
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

export default function ChittyPaymentTable({
  records,
  canEditAll,
  canEditSheet,
  currentMemberId,
  disabled = false,
  onChange,
}: Props) {
  const groups = groupByMember(records);
  const grandTotal = records.reduce((sum, record) => sum + record.cash + record.gpay, 0);

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
            <TableCell width={140}>Cash_Amt</TableCell>
            <TableCell width={140}>GPay_Amt</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No chitty users for this selection.
              </TableCell>
            </TableRow>
          )}
          {groups.map((group) => (
            <Fragment key={group.agentMemberId}>
              <TableRow>
                <TableCell colSpan={4} sx={{ bgcolor: "action.hover", borderBottom: 0, py: 1.25 }}>
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

                return (
                  <TableRow key={record.chittyUserId}>
                    <TableCell sx={{ pl: 3 }}>{record.userName}</TableCell>
                    <TableCell>
                      <NumberField
                        size="small"
                        value={record.cash}
                        disabled={!editable}
                        onChange={(cash) => updateRecord(record.chittyUserId, { cash })}
                        slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                      />
                    </TableCell>
                    <TableCell>
                      <NumberField
                        size="small"
                        value={record.gpay}
                        disabled={!editable}
                        onChange={(gpay) => updateRecord(record.chittyUserId, { gpay })}
                        slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                      />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(record.cash + record.gpay)}</TableCell>
                  </TableRow>
                );
              })}
            </Fragment>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Full payment amount</TableCell>
            <TableCell align="right">{formatCurrency(grandTotal)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
