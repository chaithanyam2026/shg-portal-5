"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Stack,
} from "@mui/material";

import FinancialYearSelector
  from "@/features/financial-year/ui/FinancialYearSelector";

import type {
  FinancialYearOption,
} from "@/features/financial-year/domain/financial-year-option";

import type {
  AttendanceFineCollectionReport,
} from "../domain/attendance-fine-collection";

import AttendanceFineCollectionTable
  from "./AttendanceFineCollectionTable";

type Props = {
  financialYearId: string;

  financialYearName: string;

  options: FinancialYearOption[];

  report: AttendanceFineCollectionReport;
};

export default function AttendanceFineCollectionPage({
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
      `/reports/attendance-fine-collection?${params.toString()}`,
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

      <AttendanceFineCollectionTable
        report={report}
      />
    </Stack>
  );
}