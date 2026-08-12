import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import { buildAttendanceFineCollection } from "@/features/reports/services/build-attendance-fine-collection";

import AttendanceFineCollectionPage from "@/features/reports/ui/AttendanceFineCollectionPage";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function AttendanceFineCollection({ searchParams }: Props) {
  const params = await searchParams;

  const financialYear = await getSelectedFinancialYear(params.financialYear);

  if (!financialYear) {
    redirect("/financial-years");
  }

  const options = await listFinancialYearOptions();

  const report = await buildAttendanceFineCollection(financialYear._id.toString());

  return (
    <>
      <PageHeader title="Attendance Fine Collection" backHref="/reports" />

      <AttendanceFineCollectionPage
        financialYearId={financialYear._id.toString()}
        financialYearName={financialYear.name}
        options={options}
        report={report}
      />
    </>
  );
}
