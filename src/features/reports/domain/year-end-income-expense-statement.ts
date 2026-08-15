import {
  getFinancialYearAbsentFineIncomeTotal,
  getFinancialYearLoanFineIncomeTotal,
  getFinancialYearLoanInterestIncomeTotal,
} from "./member-financial-summary";
import { getTotalsContributionTotal, getTotalsLoanTotal } from "./member-financial-summary-matrix";

import type { MeetingIncomeExpenseSummary } from "./meeting-income-expense-summary";
import type { MemberFinancialSummary } from "./member-financial-summary";

export type YearEndIncomeExpenseStatementData = {
  expected: {
    meetingIncome: number;

    meetingExpense: number;

    loanInterestIncome: number;

    loanFineIncome: number;

    absentFineIncome: number;

    netIncome: number;
  };

  real: {
    bankBalance: number;

    cashBalance: number;

    memberLoanTotal: number;

    memberContributionTotal: number;
  };
};

type ClosingBalance = {
  bankBalance: number;

  cashInHand: number;
};

export function buildYearEndIncomeExpenseStatementData(
  report: MemberFinancialSummary,
  meetingIncomeExpense: MeetingIncomeExpenseSummary,
  closingBalance: ClosingBalance,
): YearEndIncomeExpenseStatementData {
  const meetingIncome = meetingIncomeExpense.totals.income;
  const meetingExpense = meetingIncomeExpense.totals.expense;
  const loanInterestIncome = getFinancialYearLoanInterestIncomeTotal(report.totals);
  const loanFineIncome = getFinancialYearLoanFineIncomeTotal(report.totals);
  const absentFineIncome = getFinancialYearAbsentFineIncomeTotal(report.totals);

  return {
    expected: {
      meetingIncome,
      meetingExpense,
      loanInterestIncome,
      loanFineIncome,
      absentFineIncome,
      netIncome:
        meetingIncome +
        loanInterestIncome +
        loanFineIncome +
        absentFineIncome -
        meetingExpense,
    },
    real: {
      bankBalance: closingBalance.bankBalance,
      cashBalance: closingBalance.cashInHand,
      memberLoanTotal: getTotalsLoanTotal(report.totals),
      memberContributionTotal: getTotalsContributionTotal(report.totals),
    },
  };
}
