"use client";

import {
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { AttendanceFineSummary } from "@/features/reports/domain";

type Props = {
  attendanceFine?: AttendanceFineSummary;
};

function formatCurrency(value: number) {
  return `₹ ${value.toLocaleString("en-IN")}`;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN");
}

function getStatusColor(status: "PRESENT" | "ABSENT" | "LEAVE"): "success" | "warning" | "error" {
  switch (status) {
    case "PRESENT":
      return "success";

    case "LEAVE":
      return "warning";

    case "ABSENT":
      return "error";
  }
}

function getStatusLabel(status: "PRESENT" | "ABSENT" | "LEAVE") {
  switch (status) {
    case "PRESENT":
      return "Present";

    case "LEAVE":
      return "Approved Leave";

    case "ABSENT":
      return "Absent";
  }
}

export default function AttendanceFineTab({ attendanceFine }: Props) {
  if (!attendanceFine) {
    return <Alert severity="info">Attendance fine information is not available.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 6,
            md: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Present
              </Typography>

              <Typography variant="h4">{attendanceFine.presentCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 6,
            md: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Absent
              </Typography>

              <Typography variant="h4" color="error">
                {attendanceFine.absentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 6,
            md: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Leave
              </Typography>

              <Typography variant="h4" color="warning.main">
                {attendanceFine.leaveCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 6,
            md: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Attendance %
              </Typography>

              <Typography variant="h4" color="primary">
                {attendanceFine.attendancePercentage}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Fine
              </Typography>

              <Typography variant="h5">{formatCurrency(attendanceFine.totalFine)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Paid Fine
              </Typography>

              <Typography variant="h5" color="success.main">
                {formatCurrency(attendanceFine.paidFine)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Pending Fine
              </Typography>

              <Typography
                variant="h5"
                color={attendanceFine.pendingFine > 0 ? "error.main" : "success.main"}
              >
                {formatCurrency(attendanceFine.pendingFine)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Meeting Date</TableCell>

              <TableCell>Status</TableCell>

              <TableCell align="center">Consecutive</TableCell>

              <TableCell align="right">Fine</TableCell>

              <TableCell align="right">Paid</TableCell>

              <TableCell align="right">Pending</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {attendanceFine.entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No attendance history available.
                </TableCell>
              </TableRow>
            ) : (
              attendanceFine.entries.map((entry) => (
                <TableRow key={entry.meetingId} hover>
                  <TableCell>{formatDate(entry.meetingDate)}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={getStatusLabel(entry.status)}
                      color={getStatusColor(entry.status)}
                    />
                  </TableCell>

                  <TableCell align="center">
                    {entry.status === "ABSENT" ? entry.consecutiveAbsence : "-"}
                  </TableCell>

                  <TableCell align="right">{formatCurrency(entry.fineCharged)}</TableCell>

                  <TableCell align="right">{formatCurrency(entry.finePaid)}</TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color: entry.pendingFine > 0 ? "error.main" : "success.main",
                      fontWeight: 600,
                    }}
                  >
                    {formatCurrency(entry.pendingFine)}
                  </TableCell>
                </TableRow>
              ))
            )}

            <TableRow>
              <TableCell colSpan={3}>
                <Typography sx={{ fontWeight: 700 }}>Totals</Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(attendanceFine.totalFine)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(attendanceFine.paidFine)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography
                  color={attendanceFine.pendingFine > 0 ? "error.main" : "success.main"}
                  sx={{ fontWeight: 700 }}
                >
                  {formatCurrency(attendanceFine.pendingFine)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
