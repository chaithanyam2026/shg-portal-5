import PageHeader from "@/components/layout/PageHeader";

import { loadReportFinancialYear } from "@/features/financial-year/services";

import { buildYearEndIncomeExpenseStatementData } from "@/features/reports/domain/year-end-income-expense-statement";
import { buildIncomeExpenseReport } from "@/features/reports/services/build-income-expense-report";
import { buildMeetingIncomeExpenseSummary } from "@/features/reports/services/build-meeting-income-expense-summary";
import { buildMemberFinancialSummary } from "@/features/reports/services/build-member-financial-summary";
import FinancialYearEndReportPage from "@/features/reports/ui/FinancialYearEndReportPage";
import NoAssignedReportYears from "@/features/reports/ui/NoAssignedReportYears";

type Props = {
  searchParams: Promise<{
    financialYear?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const { financialYear, options } = await loadReportFinancialYear(params.financialYear);

  if (!financialYear) {
    return (
      <>
        <PageHeader title="Financial Year End Report" backHref="/reports" />
        <NoAssignedReportYears />
      </>
    );
  }

  const financialYearId = financialYear._id;

  const [report, meetingIncomeExpense, incomeExpenseReport] = await Promise.all([
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
