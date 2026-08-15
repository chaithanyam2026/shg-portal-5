import { Types } from "mongoose";

import { buildIncomeExpenseReport } from "@/features/reports/services/build-income-expense-report";
import { buildMemberFinancialSummary } from "@/features/reports/services/build-member-financial-summary";
import connectMongo from "@/lib/db/mongodb";
import FinancialYear from "@/models/FinancialYear";
import type { FinancialYearClosing } from "@/models/FinancialYear";

import { buildClosingBalances } from "./build-closing-balances";
import { buildMemberClosingBalances } from "./build-member-closing-balances";

export async function buildComputedClosingSnapshot(
  financialYearId: string,
): Promise<FinancialYearClosing> {
  await connectMongo();

  const financialYear = await FinancialYear.findById(financialYearId)
    .select({
      openingBalances: 1,
    })
    .lean();

  if (!financialYear) {
    throw new Error("Source financial year not found.");
  }

  const [incomeExpenseReport, memberSummary] = await Promise.all([
    buildIncomeExpenseReport(financialYearId),
    buildMemberFinancialSummary(financialYearId),
  ]);

  const openingBalances = financialYear.openingBalances ?? {
    bankBalance: 0,
    cashInHand: 0,
    excessCorpus: 0,
    investments: 0,
    otherLoans: 0,
  };

  const members = buildMemberClosingBalances(
    memberSummary.rows.map((row) => ({
      memberId: new Types.ObjectId(row.memberId),
      memberCode: row.memberCode,
      memberName: row.memberName,
      savingsBalance: row.contributionPaid,
      loanOutstanding: row.outstandingLoan,
      specialLoanOutstanding: row.outstandingSpecialLoan,
      attendanceFineOutstanding: row.absentFinePending,
      loanFineOutstanding: row.loanFinePending,
    })),
  );

  const summary = buildClosingBalances({
    bankBalance: incomeExpenseReport.closingBalance.bankBalance,
    cashInHand: incomeExpenseReport.closingBalance.cashInHand,
    excessCorpus: openingBalances.excessCorpus,
    investments: openingBalances.investments,
    memberBalances: members,
  });

  return {
    closedAt: new Date(),
    closedBy: new Types.ObjectId(),
    summary,
    members,
  };
}
