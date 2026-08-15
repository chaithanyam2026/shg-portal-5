"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Stack, Typography } from "@mui/material";

import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";
import FinancialYearSelector from "@/features/financial-year/ui/FinancialYearSelector";

import { formatDate } from "@/lib/utils/date";

import type { MeetingIncomeExpenseSummary } from "../domain/meeting-income-expense-summary";
import type { MemberFinancialSummary } from "../domain/member-financial-summary";
import type { YearEndIncomeExpenseStatementData } from "../domain/year-end-income-expense-statement";

import FinancialYearEndIncomeExpenseStatement from "./FinancialYearEndIncomeExpenseStatement";
import FinancialYearEndMeetingIncomeExpenseTable from "./FinancialYearEndMeetingIncomeExpenseTable";
import FinancialYearEndMemberSummaryMatrix from "./FinancialYearEndMemberSummaryMatrix";
import FinancialYearEndReportTable from "./FinancialYearEndReportTable";

type Props = {
  financialYearId: string;
  financialYearName: string;
  financialYearEndDate: string;
  options: FinancialYearOption[];
  report: MemberFinancialSummary;
  meetingIncomeExpense: MeetingIncomeExpenseSummary;
  incomeExpenseStatement: YearEndIncomeExpenseStatementData;
};

export default function FinancialYearEndReportPage({
  financialYearId,
  financialYearName,
  financialYearEndDate,
  options,
  report,
  meetingIncomeExpense,
  incomeExpenseStatement,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFinancialYearChange(id: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("financialYear", id);

    router.push(`/reports/year-end?${params.toString()}`);
  }

  return (
    <Stack spacing={3}>
      <FinancialYearSelector
        value={financialYearId}
        options={options}
        onChange={handleFinancialYearChange}
      />

      <Stack spacing={0.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {financialYearName}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Year-end balances as at {formatDate(financialYearEndDate)}. Pending contribution is based
          on opening contribution plus weekly contributions for each closed meeting. Loan interest
          and fines are calculated up to the financial year end date.
        </Typography>
      </Stack>

      <FinancialYearEndReportTable report={report} />

      <FinancialYearEndMemberSummaryMatrix report={report} />

      <FinancialYearEndMeetingIncomeExpenseTable summary={meetingIncomeExpense} />

      <FinancialYearEndIncomeExpenseStatement statement={incomeExpenseStatement} />
    </Stack>
  );
}
