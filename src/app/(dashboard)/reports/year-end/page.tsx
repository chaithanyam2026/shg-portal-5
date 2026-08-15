import PageHeader from "@/components/layout/PageHeader";

import {
  getSelectedFinancialYear,
  listFinancialYearOptions,
} from "@/features/financial-year/services";

import { buildYearEndIncomeExpenseStatementData } from "@/features/reports/domain/year-end-income-expense-statement";
import { buildIncomeExpenseReport } from "@/features/reports/services/build-income-expense-report";
import { buildMeetingIncomeExpenseSummary } from "@/features/reports/services/build-meeting-income-expense-summary";
import { buildMemberFinancialSummary } from "@/features/reports/services/build-member-financial-summary";
import FinancialYearEndReportPage from "@/features/reports/ui/FinancialYearEndReportPage";

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

  const [options, report, meetingIncomeExpense, incomeExpenseReport] = await Promise.all([
    listFinancialYearOptions(),
    buildMemberFinancialSummary(financialYearId),
    buildMeetingIncomeExpenseSummary(financialYearId),
    buildIncomeExpenseReport(financialYearId),
  ]);

  const incomeExpenseStatement = buildYearEndIncomeExpenseStatementData(
    report,
    meetingIncomeExpense,
    incomeExpenseReport.closingBalance,
  );

  return (
    <>
      <PageHeader title="Financial Year End Report" backHref="/reports" />

      <FinancialYearEndReportPage
        financialYearId={financialYearId}
        financialYearName={financialYear.name}
        financialYearEndDate={financialYear.endDate.toISOString()}
        options={options}
        report={report}
        meetingIncomeExpense={meetingIncomeExpense}
        incomeExpenseStatement={incomeExpenseStatement}
      />
    </>
  );
}
