"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Stack, Typography } from "@mui/material";

import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";

import FinancialYearSelector from "@/features/financial-year/ui/FinancialYearSelector";

import type { MemberFinancialSummary } from "../domain/member-financial-summary";

import MemberFinancialSummaryTable from "./MemberFinancialSummaryTable";

type Props = {
  financialYearId: string;

  options: FinancialYearOption[];

  report: MemberFinancialSummary;
};

export default function MemberFinancialSummaryPage({
  financialYearId,
  options,
  report,
}: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  function handleFinancialYearChange(id: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("financialYear", id);

    router.push(`/reports/member-summary?${params.toString()}`);
  }

  return (
    <Stack spacing={3}>
      <FinancialYearSelector
        value={financialYearId}
        options={options}
        onChange={handleFinancialYearChange}
      />

      <Typography variant="body2" color="text.secondary">
        Contribution to be paid is based on opening contribution plus weekly contributions for each
        closed meeting. Loan and fine balances are computed from loan passbooks and attendance
        records.
      </Typography>

      <MemberFinancialSummaryTable report={report} />
    </Stack>
  );
}
