"use client";

import { Chip, Grid, Stack } from "@mui/material";

import { formatDate } from "@/lib/utils/date";

import type { MeetingDashboardSummary } from "../types";

import MeetingActionButton from "@/features/meetings/ui/MeetingActionButton";
import SummaryCard from "./SummaryCard";
import SummaryTotals from "./SummaryTotals";
import ValidationItem from "./ValidationItem";

type Props = {
  meetingId: string;
  summary: MeetingDashboardSummary;
  readOnly?: boolean;
};

export default function SummaryView({ meetingId, summary, readOnly = false }: Props) {
  return (
    <Stack spacing={2}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard title="Meeting">
            <SummaryTotals
              rows={[
                {
                  label: "Date",
                  value: formatDate(summary.meetingDate),
                },
                {
                  label: "Place",
                  value: summary.place,
                },
                {
                  label: "Status",
                  value: summary.status,
                },
              ]}
            />
          </SummaryCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard title="Attendance">
            <SummaryTotals
              rows={[
                {
                  label: "Total Members",
                  value: summary.attendance.totalMembers,
                },
                {
                  label: "Present",
                  value: summary.attendance.present,
                },
                {
                  label: "Absent",
                  value: summary.attendance.absent,
                },
                {
                  label: "Leave",
                  value: summary.attendance.leave,
                },
              ]}
            />
          </SummaryCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard title="Member Payments">
            <SummaryTotals
              rows={[
                {
                  label: "Contribution",
                  value: `₹${summary.payments.contribution}`,
                },
                {
                  label: "Loan Repayment",
                  value: `₹${summary.payments.loanRepayment}`,
                },
                {
                  label: "Absent Fine",
                  value: `₹${summary.payments.absentFine}`,
                },
                {
                  label: "Special Loan Fine",
                  value: `₹${summary.payments.specialLoanFine}`,
                },
                {
                  label: "Total Collection",
                  value: `₹${summary.payments.totalCollection}`,
                },
              ]}
            />
          </SummaryCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard title="Bank Transactions">
            <SummaryTotals
              rows={[
                {
                  label: "Deposits",
                  value: `₹${summary.bank.totalDeposits}`,
                },
                {
                  label: "Withdrawals",
                  value: `₹${summary.bank.totalWithdrawals}`,
                },
                {
                  label: "Net Movement",
                  value: `₹${summary.bank.netAmount}`,
                },
              ]}
            />
          </SummaryCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard title="Financial Summary">
            <SummaryTotals
              rows={[
                {
                  label: "Member Collection",
                  value: `₹${summary.financial.memberCollection}`,
                },
                {
                  label: "Other Income",
                  value: `₹${summary.financial.otherIncome}`,
                },
                {
                  label: "Expenses",
                  value: `₹${summary.financial.expenses}`,
                },
                {
                  label: "Net Collection",
                  value: `₹${summary.financial.netMeetingCollection}`,
                },
                {
                  label: "Net Bank Movement",
                  value: `₹${summary.financial.netBankMovement}`,
                },
              ]}
            />
          </SummaryCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard title="Validation">
            <Stack spacing={1}>
              {summary.validations.map((validation, index) => (
                <ValidationItem key={index} validation={validation} />
              ))}

              <Chip
                size="small"
                color={summary.canClose ? "success" : "error"}
                label={summary.canClose ? "Ready to Close Meeting" : "Meeting Cannot Be Closed"}
              />
              <MeetingActionButton
                meetingId={meetingId}
                action="close"
                label="Close Meeting"
                color="warning"
                disabled={readOnly || summary.status !== "IN_PROGRESS" || !summary.canClose}
              />
            </Stack>
          </SummaryCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
