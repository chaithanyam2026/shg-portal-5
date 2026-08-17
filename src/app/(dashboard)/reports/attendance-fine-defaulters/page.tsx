import PageHeader from "@/components/layout/PageHeader";

import { loadReportFinancialYear } from "@/features/financial-year/services";

import { buildAttendanceFineDefaulters } from "@/features/reports/services/build-attendance-fine-defaulters";

import AttendanceFineDefaultersPage from "@/features/reports/ui/AttendanceFineDefaultersPage";
import NoAssignedReportYears from "@/features/reports/ui/NoAssignedReportYears";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function AttendanceFineDefaulters({ searchParams }: Props) {
  const params = await searchParams;

  const { financialYear, options } = await loadReportFinancialYear(params.financialYear);

  if (!financialYear) {
    return (
      <>
        <PageHeader title="Attendance Fine Defaulters" backHref="/reports" />
        <NoAssignedReportYears />
      </>
    );
  }

  const report = await buildAttendanceFineDefaulters(financialYear._id);

  return (
    <>
      <PageHeader title="Attendance Fine Defaulters" backHref="/reports" />

      <AttendanceFineDefaultersPage
        financialYearId={financialYear._id}
        financialYearName={financialYear.name}
        options={options}
        report={report}
      />
    </>
  );
}
