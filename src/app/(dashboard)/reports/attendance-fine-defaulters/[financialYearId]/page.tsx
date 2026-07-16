import PageHeader from "@/components/layout/PageHeader";

import {
  buildAttendanceFineDefaulters,
} from "@/features/reports/services/build-attendance-fine-defaulters";

import AttendanceFineDefaultersTable from "@/features/reports/ui/AttendanceFineDefaultersTable";

type Props = {
  params: Promise<{
    financialYearId: string;
  }>;
};

/**
 * Attendance Fine Defaulters
 * report page.
 */
export default async function AttendanceFineDefaultersPage({
  params,
}: Props) {
  const {
    financialYearId,
  } = await params;

  const report =
    await buildAttendanceFineDefaulters(
      financialYearId,
    );

  return (
    <>
      <PageHeader
        title="Attendance Fine Defaulters"
        backHref="/reports"
      />

      <AttendanceFineDefaultersTable
        report={report}
      />
    </>
  );
}