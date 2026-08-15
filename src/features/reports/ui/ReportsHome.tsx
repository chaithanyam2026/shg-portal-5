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

function reportHref(path: string, financialYearId: string): string {
  return `${path}?financialYear=${encodeURIComponent(financialYearId)}`;
}

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
              href={reportHref("/reports/attendance", financialYearId)}
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
              href={reportHref("/reports/attendance-fines", financialYearId)}
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
              href={reportHref("/reports/attendance-fine-defaulters", financialYearId)}
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
              href={reportHref("/reports/attendance-fine-collection", financialYearId)}
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
              title="Financial Year End Report"
              description="Member-wise paid and pending contribution, loan, interest, and fine balances."
              href={reportHref("/reports/year-end", financialYearId)}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <ReportCard
              title="Member Financial Summary"
              description="Contribution, loan, interest, and fine balances per member."
              href={reportHref("/reports/member-summary", financialYearId)}
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
              href={reportHref("/reports/income-expense", financialYearId)}
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
              href={reportHref("/reports/loans", financialYearId)}
            />
          </Grid>
        </Grid>
      </ReportCategory>
    </Stack>
  );
}
