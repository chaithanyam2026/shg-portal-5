import PageHeader from "@/components/layout/PageHeader";

import { loadReportFinancialYear } from "@/features/financial-year/services";

import { buildAttendanceFineCollection } from "@/features/reports/services/build-attendance-fine-collection";

import AttendanceFineCollectionPage from "@/features/reports/ui/AttendanceFineCollectionPage";
import NoAssignedReportYears from "@/features/reports/ui/NoAssignedReportYears";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function AttendanceFineCollection({ searchParams }: Props) {
  const params = await searchParams;

  const { financialYear, options } = await loadReportFinancialYear(params.financialYear);

  if (!financialYear) {
    return (
      <>
        <PageHeader title="Attendance Fine Collection" backHref="/reports" />
        <NoAssignedReportYears />
      </>
    );
  }

  const report = await buildAttendanceFineCollection(financialYear._id);

  return (
    <>
      <PageHeader title="Attendance Fine Collection" backHref="/reports" />

      <AttendanceFineCollectionPage
        financialYearId={financialYear._id}
        financialYearName={financialYear.name}
        options={options}
        report={report}
      />
    </>
  );
}
