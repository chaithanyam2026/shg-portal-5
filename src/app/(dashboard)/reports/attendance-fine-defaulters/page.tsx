import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import {
  buildAttendanceFineDefaulters,
} from "@/features/reports/services/build-attendance-fine-defaulters";

import AttendanceFineDefaultersPage
  from "@/features/reports/ui/AttendanceFineDefaultersPage";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function AttendanceFineDefaulters({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const financialYear =
    await getSelectedFinancialYear(
      params.financialYear,
    );

  const options =
    await listFinancialYearOptions();

  const report =
    await buildAttendanceFineDefaulters(
      financialYear._id.toString(),
    );

  return (
    <>
      <PageHeader
        title="Attendance Fine Defaulters"
      />

      <AttendanceFineDefaultersPage
        financialYearId={
          financialYear._id.toString()
        }
        financialYearName={
          financialYear.name
        }
        options={options}
        report={report}
      />
    </>
  );
}