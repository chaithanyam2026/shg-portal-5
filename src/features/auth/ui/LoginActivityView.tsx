"use client";

import {
  Alert,
  Card,
  CardContent,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import { formatDateTime } from "@/lib/utils/format";

import type { UserLoginActivitySummary } from "../services/list-login-activity";

type Props = {
  activity: UserLoginActivitySummary;
};

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6">{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default function LoginActivityView({ activity }: Props) {
  return (
    <Stack spacing={3}>
      <PageHeader title={`Activity · ${activity.username}`} backHref="/settings/users" />

      <Alert severity="info">
        Password logins are counted separately from app opens. Opening the installed app while
        already signed in is recorded as an app open. Users stay logged in.
      </Alert>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 4 }}>
          <SummaryCard label="Successful logins" value={activity.loginCount} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <SummaryCard label="Failed logins" value={activity.failedLoginCount} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <SummaryCard label="App opens" value={activity.sessionOpenCount} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard label="Last login" value={formatDateTime(activity.lastLoginAt)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard label="Last failed login" value={formatDateTime(activity.lastFailedLoginAt)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard label="Last opened" value={formatDateTime(activity.lastSeenAt)} />
        </Grid>
      </Grid>

      <TableContainer component={Card}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>IP</TableCell>
              <TableCell>Device</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activity.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No activity recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              activity.items.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDateTime(item.occurredAt)}</TableCell>
                  <TableCell>{item.typeLabel}</TableCell>
                  <TableCell>{item.ipAddress || "—"}</TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap title={item.userAgent}>
                      {item.userAgent || "—"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
