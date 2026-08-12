import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import ReportsPageClient from "@/features/reports/ui/ReportsPageClient";

import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const financialYear = await getSelectedFinancialYear(params.financialYear);

  if (!financialYear) {
    redirect("/financial-years");
  }

  const options = await listFinancialYearOptions();

  return (
    <>
      <PageHeader
        title="Reports"
        showBack={false}
        subtitle="Attendance, contribution, loan, and financial reports."
      />

      <ReportsPageClient
        financialYearId={financialYear._id.toString()}
        options={options}
      />
    </>
  );
}
