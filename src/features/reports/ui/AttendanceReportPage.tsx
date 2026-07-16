"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Stack,
} from "@mui/material";

import type {
  AttendanceRegister,
} from "../domain";

import type {
  FinancialYearOption,
} from "@/features/financial-year/domain/financial-year-option";

import FinancialYearSelector
  from "@/features/financial-year/ui/FinancialYearSelector";

import AttendanceRegisterTable
  from "./AttendanceRegisterTable";

type Props = {
  financialYearId: string;

  financialYearName: string;

  options: FinancialYearOption[];

  register: AttendanceRegister;
};

export default function AttendanceReportPage({
  financialYearId,
  options,
  register,
}: Props) {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  function handleChange(
    id: string,
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    params.set(
      "financialYear",
      id,
    );

    router.push(
      `/reports/attendance?${params.toString()}`,
    );
  }

  return (
    <Stack spacing={3}>
      <FinancialYearSelector
        value={
          financialYearId
        }
        options={options}
        onChange={
          handleChange
        }
      />

      <AttendanceRegisterTable
        register={register}
      />
    </Stack>
  );
}