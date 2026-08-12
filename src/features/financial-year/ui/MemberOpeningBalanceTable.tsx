"use client";

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { MemberOpeningBalance } from "../domain";

type Props = {
  members: MemberOpeningBalance[];
};

function formatAmount(value: number | undefined) {
  return (value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function MemberOpeningBalanceTable({ members }: Props) {
  if (members.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary" align="center">
            No member opening balances available.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <TableContainer component={Card} variant="outlined">
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell width={80}>Code</TableCell>

            <TableCell>Member</TableCell>

            <TableCell align="right">Savings</TableCell>

            <TableCell align="right">Loan</TableCell>

            <TableCell align="right">Interest</TableCell>

            <TableCell align="right">Fine</TableCell>

            <TableCell align="right">Share Capital</TableCell>

            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {members.map((member) => {
            const total =
              (member.savings ?? 0) +
              (member.loanOutstanding ?? 0) +
              (member.interestReceivable ?? 0) +
              (member.fineOutstanding ?? 0) +
              (member.shareCapital ?? 0);

            return (
              <TableRow hover key={member.memberId}>
                <TableCell>{member.memberCode}</TableCell>

                <TableCell>{member.memberName}</TableCell>

                <TableCell align="right">₹{formatAmount(member.savings)}</TableCell>

                <TableCell align="right">₹{formatAmount(member.loanOutstanding)}</TableCell>

                <TableCell align="right">₹{formatAmount(member.interestReceivable)}</TableCell>

                <TableCell align="right">₹{formatAmount(member.fineOutstanding)}</TableCell>

                <TableCell align="right">₹{formatAmount(member.shareCapital)}</TableCell>

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  ₹{formatAmount(total)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
