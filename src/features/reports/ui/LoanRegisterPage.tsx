"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Stack, Typography } from "@mui/material";

import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";

import FinancialYearSelector from "@/features/financial-year/ui/FinancialYearSelector";

import type { LoanRegister } from "../domain/loan-register";

import LoanRegisterTable from "./LoanRegisterTable";

type Props = {
  financialYearId: string;
  options: FinancialYearOption[];
  register: LoanRegister;
};

export default function LoanRegisterPage({ financialYearId, options, register }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFinancialYearChange(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("financialYear", id);
    router.push(`/reports/loans?${params.toString()}`);
  }

  return (
    <Stack spacing={3}>
      <FinancialYearSelector
        value={financialYearId}
        options={options}
        onChange={handleFinancialYearChange}
      />

      <Typography variant="body2" color="text.secondary">
        Loan register for the selected financial year. Expand each section to review disbursed
        amounts, repayments, and outstanding principal, interest, and fines. Loan numbers link to
        the full passbook.
      </Typography>

      <LoanRegisterTable register={register} />
    </Stack>
  );
}
