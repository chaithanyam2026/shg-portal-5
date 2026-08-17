import PageHeader from "@/components/layout/PageHeader";

import { loadReportFinancialYear } from "@/features/financial-year/services";

import { buildMemberFinancialSummary } from "@/features/reports/services/build-member-financial-summary";
import MemberFinancialSummaryPage from "@/features/reports/ui/MemberFinancialSummaryPage";
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
        <PageHeader title="Member Financial Summary" backHref="/reports" />
        <NoAssignedReportYears />
      </>
    );
  }

  const report = await buildMemberFinancialSummary(financialYear._id);

  return (
    <>
      <PageHeader title="Member Financial Summary" backHref="/reports" />

      <MemberFinancialSummaryPage
        financialYearId={financialYear._id}
        options={options}
        report={report}
      />
    </>
  );
}
