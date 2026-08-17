import PageHeader from "@/components/layout/PageHeader";

import { loadReportFinancialYear } from "@/features/financial-year/services";

import { buildIncomeExpenseReport } from "@/features/reports/services";
import IncomeExpenseReportPage from "@/features/reports/ui/IncomeExpenseReportPage";
import NoAssignedReportYears from "@/features/reports/ui/NoAssignedReportYears";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const { financialYear, options } = await loadReportFinancialYear(params.financialYear);

  if (!financialYear) {
    return (
      <>
        <PageHeader title="Income & Expense" backHref="/reports" />
        <NoAssignedReportYears />
      </>
    );
  }

  const report = await buildIncomeExpenseReport(financialYear._id);

  return (
    <>
      <PageHeader title="Income & Expense" backHref="/reports" />

      <IncomeExpenseReportPage
        financialYearId={financialYear._id}
        options={options}
        report={report}
      />
    </>
  );
}
