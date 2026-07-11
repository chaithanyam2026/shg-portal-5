"use client";

import {
  Chip,
  Stack,
} from "@mui/material";

import type {
  MeetingSummary,
} from "../types";

import SummaryCard from "./SummaryCard";
import SummaryTotals from "./SummaryTotals";
import ValidationItem from "./ValidationItem";
import MeetingActionButton from "@/features/meetings/ui/MeetingActionButton";

type Props = {
  meetingId: string;
  summary: MeetingSummary;
};

export default function SummaryView({
  meetingId,
  summary,
}: Props) {
  return (
    <Stack spacing={3}>
      <SummaryCard title="Meeting">
        <SummaryTotals
          rows={[
            {
              label: "Date",
              value:
                new Date(
                  summary.meetingDate,
                ).toLocaleDateString(),
            },
            {
              label: "Place",
              value:
                summary.place,
            },
            {
              label: "Status",
              value:
                summary.status,
            },
          ]}
        />
      </SummaryCard>

      <SummaryCard title="Attendance">
        <SummaryTotals
          rows={[
            {
              label:
                "Total Members",
              value:
                summary
                  .attendance
                  .totalMembers,
            },
            {
              label:
                "Present",
              value:
                summary
                  .attendance
                  .present,
            },
            {
              label:
                "Absent",
              value:
                summary
                  .attendance
                  .absent,
            },
            {
              label:
                "Excused",
              value:
                summary
                  .attendance
                  .excused,
            },
          ]}
        />
      </SummaryCard>

      <SummaryCard title="Member Payments">
        <SummaryTotals
          rows={[
            {
              label:
                "Contribution",
              value: `₹${summary.payments.contribution}`,
            },
            {
              label:
                "Loan Repayment",
              value: `₹${summary.payments.loanRepayment}`,
            },
            {
              label:
                "Absent Fine",
              value: `₹${summary.payments.absentFine}`,
            },
            {
              label:
                "Special Loan Fine",
              value: `₹${summary.payments.specialLoanFine}`,
            },
            {
              label:
                "Total Collection",
              value: `₹${summary.payments.totalCollection}`,
            },
          ]}
        />
      </SummaryCard>

      <SummaryCard title="Bank Transactions">
        <SummaryTotals
          rows={[
            {
              label:
                "Deposits",
              value: `₹${summary.bank.totalDeposits}`,
            },
            {
              label:
                "Withdrawals",
              value: `₹${summary.bank.totalWithdrawals}`,
            },
            {
              label:
                "Net Movement",
              value: `₹${summary.bank.netAmount}`,
            },
          ]}
        />
      </SummaryCard>

      <SummaryCard title="Financial Summary">
        <SummaryTotals
          rows={[
            {
              label:
                "Member Collection",
              value: `₹${summary.financial.memberCollection}`,
            },
            {
              label:
                "Other Income",
              value: `₹${summary.financial.otherIncome}`,
            },
            {
              label:
                "Expenses",
              value: `₹${summary.financial.expenses}`,
            },
            {
              label:
                "Net Collection",
              value: `₹${summary.financial.netMeetingCollection}`,
            },
            {
              label:
                "Net Bank Movement",
              value: `₹${summary.financial.netBankMovement}`,
            },
          ]}
        />
      </SummaryCard>

      <SummaryCard title="Validation">
        <Stack spacing={2}>
          {summary.validations.map(
            (
              validation,
              index,
            ) => (
              <ValidationItem
                key={index}
                validation={
                  validation
                }
              />
            ),
          )}

          <Chip
            color={
              summary.canClose
                ? "success"
                : "error"
            }
            label={
              summary.canClose
                ? "Ready to Close Meeting"
                : "Meeting Cannot Be Closed"
            }
          />
          <MeetingActionButton
            meetingId={meetingId}
            action="close"
            label="Close Meeting"
            color="warning"
            disabled={summary.status !== "IN_PROGRESS"}
          />
        </Stack>
      </SummaryCard>
    </Stack>
  );
}