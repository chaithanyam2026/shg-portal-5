"use client";

import { useRouter, useSearchParams } from "next/navigation";

import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";

import ReportsHome from "./ReportsHome";

type Props = {
  financialYearId: string;

  options: FinancialYearOption[];
};

export default function ReportsPageClient({ financialYearId, options }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  function handleFinancialYearChange(id: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("financialYear", id);

    router.push(`/reports?${params.toString()}`);
  }

  return (
    <ReportsHome
      financialYearId={financialYearId}
      options={options}
      onFinancialYearChange={handleFinancialYearChange}
    />
  );
}
