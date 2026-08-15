"use client";

import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { MemberSummary } from "../types";

import PageHeader from "@/components/layout/PageHeader";
import { formatDate } from "@/lib/utils/format";

type Props = {
  members: MemberSummary[];
};

export default function MemberList({ members }: Props) {
  if (members.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography align="center" color="text.secondary">
            No members found.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Members" showBack={false}>
        <Button component={Link} href="/members/new" variant="contained">
          New Member
        </Button>
      </PageHeader>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>

              <TableCell>Name</TableCell>

              <TableCell>Phone</TableCell>

              <TableCell>Joined</TableCell>

              <TableCell>Deactivated</TableCell>

              <TableCell>Status</TableCell>

              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {members.map((member) => (
              <TableRow hover key={member._id}>
                <TableCell>{member.memberCode}</TableCell>

                <TableCell>{member.name}</TableCell>

                <TableCell>{member.phone}</TableCell>

                <TableCell>{member.joinedDate ? formatDate(member.joinedDate) : "-"}</TableCell>

                <TableCell>
                  {member.deactivatedDate ? formatDate(member.deactivatedDate) : "-"}
                </TableCell>

                <TableCell>
                  <Chip
                    label={member.status}
                    color={member.status === "ACTIVE" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>

                <TableCell align="center">
                  <Button
                    component={Link}
                    href={`/members/${member._id}`}
                    size="small"
                    variant="outlined"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
