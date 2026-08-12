"use client";

import { Grid, Stack } from "@mui/material";

import FinancialYearSelector from "@/features/financial-year/ui/FinancialYearSelector";

import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";

import ReportCategory from "./ReportCategory";

import ReportCard from "./ReportCard";

type Props = {
  financialYearId: string;

  options: FinancialYearOption[];

  onFinancialYearChange(id: string): void;
};

export default function ReportsHome({ financialYearId, options, onFinancialYearChange }: Props) {
  return (
    <Stack spacing={4}>
      <FinancialYearSelector
        value={financialYearId}
        options={options}
        onChange={onFinancialYearChange}
      />

      <ReportCategory title="Attendance Reports">
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <ReportCard
              title="Attendance Register"
              description="Complete attendance register."
              href="/reports/attendance"
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <ReportCard
              title="Attendance Fine Register"
              description="Attendance fine summary."
              href="/reports/attendance-fines"
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <ReportCard
              title="Attendance Fine Defaulters"
              description="Members with pending attendance fines."
              href="/reports/attendance-fine-defaulters"
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <ReportCard
              title="Attendance Fine Collection"
              description="Meeting-wise attendance fine collection."
              href="/reports/attendance-fine-collection"
            />
          </Grid>
        </Grid>
      </ReportCategory>

      <ReportCategory title="Financial Reports">
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <ReportCard
              title="Member Financial Summary"
              description="Contribution, loan, interest, and fine balances per member."
              href="/reports/member-summary"
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <ReportCard
              title="Income & Expense"
              description="Income and expense statement."
              href="/reports/income-expense"
            />
          </Grid>
        </Grid>
      </ReportCategory>

      <ReportCategory title="Loan Reports">
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <ReportCard
              title="Loan Register"
              description="Loan register and balances."
              href="/reports/loans"
            />
          </Grid>
        </Grid>
      </ReportCategory>
    </Stack>
  );
}
