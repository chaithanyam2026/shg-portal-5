import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import { buildAttendanceFineRegister } from "@/features/reports/services/build-attendance-fine-register";

import AttendanceFineRegisterPage from "@/features/reports/ui/AttendanceFineRegisterPage";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function AttendanceFineRegister({ searchParams }: Props) {
  const params = await searchParams;

  const financialYear = await getSelectedFinancialYear(params.financialYear);
  if (!financialYear) {
    redirect("/financial-years");
  }

  const options = await listFinancialYearOptions();

  const register = await buildAttendanceFineRegister(financialYear._id.toString());

  return (
    <>
      <PageHeader title="Attendance Fine Register" backHref="/reports" />

      <AttendanceFineRegisterPage
        financialYearId={financialYear._id.toString()}
        financialYearName={financialYear.name}
        options={options}
        register={register}
      />
    </>
  );
}
