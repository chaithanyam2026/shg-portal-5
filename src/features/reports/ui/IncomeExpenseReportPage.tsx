"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Stack, Typography } from "@mui/material";

import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";

import FinancialYearSelector from "@/features/financial-year/ui/FinancialYearSelector";

import type { IncomeExpenseReport as IncomeExpenseReportModel } from "../types";

import { IncomeExpenseReport } from "./IncomeExpenseReport";

type Props = {
  financialYearId: string;
  options: FinancialYearOption[];
  report: IncomeExpenseReportModel;
};

export default function IncomeExpenseReportPage({
  financialYearId,
  options,
  report,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFinancialYearChange(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("financialYear", id);
    router.push(`/reports/income-expense?${params.toString()}`);
  }

  return (
    <Stack spacing={3}>
      <FinancialYearSelector
        value={financialYearId}
        options={options}
        onChange={handleFinancialYearChange}
      />

      <Typography variant="body2" color="text.secondary">
        Income and expense statement from closed meetings: absent fine, loan fine, loan interest,
        bank interest, meeting income entries, and meeting expenses. Cash book below tracks overall
        cash and bank movement.
      </Typography>

      <IncomeExpenseReport report={report} />
    </Stack>
  );
}
