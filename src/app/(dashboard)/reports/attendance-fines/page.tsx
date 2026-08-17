import PageHeader from "@/components/layout/PageHeader";

import { loadReportFinancialYear } from "@/features/financial-year/services";

import { buildAttendanceFineRegister } from "@/features/reports/services/build-attendance-fine-register";

import AttendanceFineRegisterPage from "@/features/reports/ui/AttendanceFineRegisterPage";
import NoAssignedReportYears from "@/features/reports/ui/NoAssignedReportYears";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function AttendanceFineRegister({ searchParams }: Props) {
  const params = await searchParams;

  const { financialYear, options } = await loadReportFinancialYear(params.financialYear);

  if (!financialYear) {
    return (
      <>
        <PageHeader title="Attendance Fine Register" backHref="/reports" />
        <NoAssignedReportYears />
      </>
    );
  }

  const register = await buildAttendanceFineRegister(financialYear._id);

  return (
    <>
      <PageHeader title="Attendance Fine Register" backHref="/reports" />

      <AttendanceFineRegisterPage
        financialYearId={financialYear._id}
        financialYearName={financialYear.name}
        options={options}
        register={register}
      />
    </>
  );
}
