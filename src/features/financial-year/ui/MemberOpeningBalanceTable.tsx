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

function formatAmount(value: number) {
  return value.toLocaleString("en-IN", {
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

            <TableCell align="right">Other</TableCell>

            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {members.map((member) => {
            const total =
              member.savings + member.loan + member.interest + member.fine + member.other;

            return (
              <TableRow hover key={member.memberId}>
                <TableCell>{member.memberCode}</TableCell>

                <TableCell>{member.memberName}</TableCell>

                <TableCell align="right">₹{formatAmount(member.savings)}</TableCell>

                <TableCell align="right">₹{formatAmount(member.loan)}</TableCell>

                <TableCell align="right">₹{formatAmount(member.interest)}</TableCell>

                <TableCell align="right">₹{formatAmount(member.fine)}</TableCell>

                <TableCell align="right">₹{formatAmount(member.other)}</TableCell>

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
