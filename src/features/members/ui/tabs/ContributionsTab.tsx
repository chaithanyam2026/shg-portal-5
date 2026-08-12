"use client";

import {
  Alert,
  Card,
  CardContent,
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

import type { MemberContributionPayments } from "../../domain/member-contribution-payments";

import { formatCurrency, formatDate } from "@/lib/utils/format";

type Props = {
  contributions: MemberContributionPayments;
};

export default function ContributionsTab({ contributions }: Props) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Expected
              </Typography>

              <Typography variant="h5">{formatCurrency(contributions.totalExpected)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Paid
              </Typography>

              <Typography variant="h5" color="success.main">
                {formatCurrency(contributions.totalPaid)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                To Be Paid
              </Typography>

              <Typography
                variant="h5"
                color={contributions.totalPending > 0 ? "error.main" : "success.main"}
              >
                {formatCurrency(contributions.totalPending)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Closed Meetings
              </Typography>

              <Typography variant="h5">{contributions.closedMeetingCount}</Typography>

              <Typography variant="caption" color="text.secondary">
                Weekly amount: {formatCurrency(contributions.weeklyContributionAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>

              <TableCell>Description</TableCell>

              <TableCell align="right">Expected</TableCell>

              <TableCell align="right">Paid</TableCell>

              <TableCell align="right">Pending</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {contributions.entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No contribution payments recorded.
                </TableCell>
              </TableRow>
            ) : (
              contributions.entries.map((entry) => (
                <TableRow
                  key={entry.meetingId ?? `opening-${entry.meetingDate}`}
                  hover
                >
                  <TableCell>{formatDate(entry.meetingDate)}</TableCell>

                  <TableCell>{entry.description}</TableCell>

                  <TableCell align="right">{formatCurrency(entry.expectedAmount)}</TableCell>

                  <TableCell align="right">{formatCurrency(entry.paidAmount)}</TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color: entry.pendingAmount > 0 ? "error.main" : "success.main",
                      fontWeight: entry.pendingAmount > 0 ? 600 : 400,
                    }}
                  >
                    {formatCurrency(entry.pendingAmount)}
                  </TableCell>
                </TableRow>
              ))
            )}

            <TableRow>
              <TableCell colSpan={2}>
                <Typography sx={{ fontWeight: 700 }}>Totals</Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(contributions.totalExpected)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(contributions.totalPaid)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography
                  color={contributions.totalPending > 0 ? "error.main" : "success.main"}
                  sx={{ fontWeight: 700 }}
                >
                  {formatCurrency(contributions.totalPending)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
