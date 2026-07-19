import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import AttendanceReportPage from "@/features/reports/ui/AttendanceReportPage";

import { buildAttendanceRegister } from "@/features/reports/services/build-attendance-register";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

const AttendancePage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const financialYear = await getSelectedFinancialYear(params.financialYear);
  if (!financialYear) {
    redirect("/financial-years");
  }

  const options = await listFinancialYearOptions();

  const register = await buildAttendanceRegister(financialYear._id.toString());

  return (
    <>
      <PageHeader title="Attendance Register" />

      <AttendanceReportPage
        financialYearId={financialYear._id.toString()}
        financialYearName={financialYear.name}
        options={options}
        register={register}
      />
    </>
  );
};

export default AttendancePage;
