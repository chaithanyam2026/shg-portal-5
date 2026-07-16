import PageHeader from "@/components/layout/PageHeader";

import {
  buildAttendanceFineRegister,
} from "@/features/reports/services/build-attendance-fine-register";

import AttendanceFineRegisterTable from "@/features/reports/ui/AttendanceFineRegisterTable";

type Props = {
  params: Promise<{
    financialYearId: string;
  }>;
};

/**
 * Attendance Fine Register page.
 */
export default async function AttendanceFineRegisterPage({
  params,
}: Props) {
  const {
    financialYearId,
  } = await params;

  const register =
    await buildAttendanceFineRegister(
      financialYearId,
    );

  return (
    <>
      <PageHeader
        title="Attendance Fine Register"
        backHref="/reports"
      />

      <AttendanceFineRegisterTable
        register={register}
      />
    </>
  );
}