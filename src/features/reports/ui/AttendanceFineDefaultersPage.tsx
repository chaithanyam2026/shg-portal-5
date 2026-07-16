"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Stack,
} from "@mui/material";

import type {
  FinancialYearOption,
} from "@/features/financial-year/domain/financial-year-option";

import FinancialYearSelector
  from "@/features/financial-year/ui/FinancialYearSelector";

import type {
  AttendanceFineDefaultersReport,
} from "../domain/attendance-fine-defaulters";

import AttendanceFineDefaultersTable
  from "./AttendanceFineDefaultersTable";

type Props = {
  financialYearId: string;

  financialYearName: string;

  options: FinancialYearOption[];

  report: AttendanceFineDefaultersReport;
};

export default function AttendanceFineDefaultersPage({
  financialYearId,
  options,
  report,
}: Props) {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  function handleChange(
    financialYearId: string,
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    params.set(
      "financialYear",
      financialYearId,
    );

    router.push(
      `/reports/attendance-fine-defaulters?${params.toString()}`,
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

      <AttendanceFineDefaultersTable
        report={report}
      />
    </Stack>
  );
}