import PageHeader from "@/components/layout/PageHeader";

import {
  buildAttendanceFineCollection,
} from "@/features/reports/services/build-attendance-fine-collection";

import AttendanceFineCollectionTable from "@/features/reports/ui/AttendanceFineCollectionTable";

type Props = {
  params: Promise<{
    financialYearId: string;
  }>;
};

/**
 * Attendance Fine Collection
 * report page.
 */
export default async function AttendanceFineCollectionPage({
  params,
}: Props) {
  const {
    financialYearId,
  } = await params;

  const report =
    await buildAttendanceFineCollection(
      financialYearId,
    );

  return (
    <>
      <PageHeader
        title="Attendance Fine Collection"
        backHref="/reports"
      />

      <AttendanceFineCollectionTable
        report={report}
      />
    </>
  );
}