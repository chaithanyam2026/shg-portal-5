"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  MenuItem,
  Select,
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

import type { UserListItem } from "@/features/auth/services/list";
import PageHeader from "@/components/layout/PageHeader";
import { isAdminRole, ROLE_LABELS, USER_ROLE_VALUES, type UserRole } from "@/lib/auth/roles";
import { formatDateTime } from "@/lib/utils/format";

import CreateUserDialog from "./CreateUserDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";

type Props = {
  users: UserListItem[];
  currentUserId: string;
};

export default function UserList({ users, currentUserId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [resetUser, setResetUser] = useState<UserListItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleRoleChange(userId: string, role: UserRole) {
    startTransition(async () => {
      try {
        setError(null);

        const response = await fetch(`/api/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message ?? "Unable to update access level.");
          return;
        }

        setMessage("Access level updated.");
        router.refresh();
      } catch {
        setError("Unable to update access level.");
      }
    });
  }

  function handleStatusToggle(user: UserListItem) {
    if (user._id === currentUserId) {
      setError("You cannot change your own account status.");
      return;
    }

    const action = user.status === "ACTIVE" ? "close" : "activate";

    startTransition(async () => {
      try {
        setError(null);

        const response = await fetch(`/api/users/${user._id}/${action}`, {
          method: "POST",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message ?? "Unable to update user status.");
          return;
        }

        setMessage(user.status === "ACTIVE" ? "User deactivated." : "User activated.");
        router.refresh();
      } catch {
        setError("Unable to update user status.");
      }
    });
  }

  if (users.length === 0) {
    return (
      <Stack spacing={3}>
        <PageHeader title="Users" showBack={false}>
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            New User
          </Button>
        </PageHeader>

        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              No users found.
            </Typography>
          </CardContent>
        </Card>

        <CreateUserDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false);
            setMessage("User created.");
            router.refresh();
          }}
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Users" showBack={false}>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          New User
        </Button>
      </PageHeader>

      <Alert severity="info">
        Administrators can reset passwords for members, secretaries, and treasurers. Admin accounts
        must change their own password.
      </Alert>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>Access Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Logins</TableCell>
              <TableCell>Failed</TableCell>
              <TableCell>App opens</TableCell>
              <TableCell>Last login</TableCell>
              <TableCell>Last opened</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow hover key={user._id}>
                <TableCell>{user.username}</TableCell>

                <TableCell>{user.member ? `${user.member.memberCode} — ${user.member.name}` : "—"}</TableCell>

                <TableCell>
                  <FormControl size="small" fullWidth disabled={isPending || user._id === currentUserId}>
                    <Select
                      value={user.role}
                      onChange={(event) => handleRoleChange(user._id, event.target.value as UserRole)}
                    >
                      {USER_ROLE_VALUES.map((role) => (
                        <MenuItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === "ACTIVE" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>

                <TableCell>{user.loginCount}</TableCell>
                <TableCell>{user.failedLoginCount}</TableCell>
                <TableCell>{user.sessionOpenCount}</TableCell>
                <TableCell>{formatDateTime(user.lastLoginAt)}</TableCell>
                <TableCell>{formatDateTime(user.lastSeenAt)}</TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      component={Link}
                      href={`/settings/users/${user._id}/activity`}
                    >
                      Activity
                    </Button>

                    {!isAdminRole(user.role) && (
                      <Button size="small" variant="outlined" onClick={() => setResetUser(user)}>
                        Reset Password
                      </Button>
                    )}

                    <Button
                      size="small"
                      variant="outlined"
                      color={user.status === "ACTIVE" ? "warning" : "success"}
                      disabled={user._id === currentUserId || isPending}
                      onClick={() => handleStatusToggle(user)}
                    >
                      {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          setMessage("User created.");
          router.refresh();
        }}
      />

      <ResetPasswordDialog
        user={resetUser}
        onClose={() => setResetUser(null)}
        onSuccess={() => {
          setResetUser(null);
          setMessage("Password reset.");
        }}
      />

      <Snackbar
        open={message !== null}
        autoHideDuration={4000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={error !== null}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
