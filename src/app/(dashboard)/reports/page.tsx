import PageHeader from "@/components/layout/PageHeader";

import { loadReportFinancialYear } from "@/features/financial-year/services";

import NoAssignedReportYears from "@/features/reports/ui/NoAssignedReportYears";
import ReportsPageClient from "@/features/reports/ui/ReportsPageClient";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const { financialYear, options } = await loadReportFinancialYear(params.financialYear);

  return (
    <>
      <PageHeader
        title="Reports"
        showBack={false}
        subtitle="Attendance, contribution, loan, and financial reports."
      />

      {financialYear ? (
        <ReportsPageClient financialYearId={financialYear._id} options={options} />
      ) : (
        <NoAssignedReportYears />
      )}
    </>
  );
}
