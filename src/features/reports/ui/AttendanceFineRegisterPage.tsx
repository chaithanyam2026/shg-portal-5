"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Stack } from "@mui/material";

import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";

import FinancialYearSelector from "@/features/financial-year/ui/FinancialYearSelector";

import type { AttendanceFineRegister } from "../domain/attendance-fine-register";

import AttendanceFineRegisterTable from "./AttendanceFineRegisterTable";

type Props = {
  financialYearId: string;

  financialYearName: string;

  options: FinancialYearOption[];

  register: AttendanceFineRegister;
};

export default function AttendanceFineRegisterPage({ financialYearId, options, register }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  function handleChange(financialYearId: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("financialYear", financialYearId);

    router.push(`/reports/attendance-fines?${params.toString()}`);
  }

  return (
    <Stack spacing={3}>
      <FinancialYearSelector value={financialYearId} options={options} onChange={handleChange} />

      <AttendanceFineRegisterTable register={register} />
    </Stack>
  );
}
