import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import { buildIncomeExpenseReport } from "@/features/reports/services";
import IncomeExpenseReportPage from "@/features/reports/ui/IncomeExpenseReportPage";

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

  const financialYearId = financialYear._id.toString();

  const [options, report] = await Promise.all([
    listFinancialYearOptions(),
    buildIncomeExpenseReport(financialYearId),
  ]);

  return (
    <>
      <PageHeader title="Income & Expense" backHref="/reports" />

      <IncomeExpenseReportPage
        financialYearId={financialYearId}
        options={options}
        report={report}
      />
    </>
  );
}
