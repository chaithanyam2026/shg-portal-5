import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import { buildAttendanceFineRegister } from "@/features/reports/services/build-attendance-fine-register";
import { buildAttendanceRegister } from "@/features/reports/services/build-attendance-register";
import AttendancePage from "@/features/reports/ui/AttendancePage";

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

  const [options, register, fineRegister] = await Promise.all([
    listFinancialYearOptions(),
    buildAttendanceRegister(financialYearId),
    buildAttendanceFineRegister(financialYearId),
  ]);

  return (
    <>
      <PageHeader title="Attendance" showBack={false} />

      <AttendancePage
        financialYearId={financialYearId}
        options={options}
        register={register}
        fineRegister={fineRegister}
      />
    </>
  );
}
