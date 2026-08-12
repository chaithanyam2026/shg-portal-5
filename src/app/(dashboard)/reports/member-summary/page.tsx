import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import { buildMemberFinancialSummary } from "@/features/reports/services/build-member-financial-summary";
import MemberFinancialSummaryPage from "@/features/reports/ui/MemberFinancialSummaryPage";

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
    buildMemberFinancialSummary(financialYearId),
  ]);

  return (
    <>
      <PageHeader title="Member Financial Summary" backHref="/reports" />

      <MemberFinancialSummaryPage
        financialYearId={financialYearId}
        options={options}
        report={report}
      />
    </>
  );
}
