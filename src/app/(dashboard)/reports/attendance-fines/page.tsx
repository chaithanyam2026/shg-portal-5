import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import { buildAttendanceFineRegister } from "@/features/reports/services/build-attendance-fine-register";

import AttendanceFineRegisterPage from "@/features/reports/ui/AttendanceFineRegisterPage";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function AttendanceFineRegister({ searchParams }: Props) {
  const params = await searchParams;

  const financialYear = await getSelectedFinancialYear(params.financialYear);

  const options = await listFinancialYearOptions();

  const register = await buildAttendanceFineRegister(financialYear._id.toString());

  return (
    <>
      <PageHeader title="Attendance Fine Register" />

      <AttendanceFineRegisterPage
        financialYearId={financialYear._id.toString()}
        financialYearName={financialYear.name}
        options={options}
        register={register}
      />
    </>
  );
}
