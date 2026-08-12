import PageHeader from "@/components/layout/PageHeader";

import { buildAttendanceRegister } from "@/features/reports/services/build-attendance-register";

import AttendanceRegisterPrint from "@/features/reports/ui/AttendanceRegisterPrint";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    financialYearId: string;
  }>;
};

/**
 * Print-friendly Attendance Register.
 */
export default async function AttendanceRegisterPrintPage({ params }: Props) {
  const { financialYearId } = await params;
  if (!financialYearId) {
    redirect("/financial-years");
  }

  const register = await buildAttendanceRegister(financialYearId);

  return (
    <>
      <PageHeader
        title="Attendance Register"
        subtitle="Print Preview"
        backHref="/attendance"
      />

      <AttendanceRegisterPrint financialYearId={financialYearId} register={register} />
    </>
  );
}
