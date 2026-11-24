"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Snackbar,
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

import MemberResetPasswordDialog from "./MemberResetPasswordDialog";

type Props = {
  members: MemberSummary[];
  canManageMembers?: boolean;
  canResetPassword?: boolean;
};

export default function MemberList({
  members,
  canManageMembers = false,
  canResetPassword = false,
}: Props) {
  const [resetMember, setResetMember] = useState<MemberSummary | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  return (
    <Stack spacing={3}>
      <PageHeader title="Members" showBack={false}>
        {canManageMembers && (
          <Button component={Link} href="/members/new" variant="contained">
            New Member
          </Button>
        )}
      </PageHeader>

      {members.length === 0 ? (
        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              No members found.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>

                <TableCell>Name</TableCell>

                {/* <TableCell>Phone</TableCell>

                <TableCell>Joined</TableCell>

                <TableCell>Deactivated</TableCell>

                <TableCell>Status</TableCell> */}

                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {members.map((member) => (
                <TableRow hover key={member._id}>
                  <TableCell>{member.memberCode}</TableCell>

                  <TableCell>{member.name}</TableCell>

                  {/* <TableCell>{member.phone}</TableCell>

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
                  </TableCell> */}

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ justifyContent: "center", flexWrap: "wrap" }}
                    >
                      <Button
                        component={Link}
                        href={`/members/${member._id}`}
                        size="small"
                        variant="outlined"
                      >
                        View
                      </Button>

                      {canResetPassword && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setResetMember(member)}
                        >
                          Reset Password
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {canResetPassword && (
        <MemberResetPasswordDialog
          member={resetMember}
          onClose={() => setResetMember(null)}
          onSuccess={() => {
            setResetMember(null);
            setResetMessage("Password reset.");
          }}
        />
      )}

      <Snackbar
        open={resetMessage !== null}
        autoHideDuration={4000}
        onClose={() => setResetMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setResetMessage(null)}>
          {resetMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
