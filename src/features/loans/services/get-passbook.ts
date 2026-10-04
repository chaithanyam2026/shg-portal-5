import { cache } from "react";

import connectMongo from "@/lib/db/mongodb";
import { toCalendarDate } from "@/lib/utils/date";

import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";

import type { LoanPassbook } from "../domain";

import { LoanIdInput, LoanIdSchema } from "../validation";

import { Types } from "mongoose";
import { buildLoanLedger } from "./internal/loan-ledger";

export async function loadLoanPassbook(loanId: string): Promise<LoanPassbook> {
  await connectMongo();

  const loan = await Loan.findById(loanId)
    .populate<{
      memberId: {
        _id: Types.ObjectId;
        name: string;
      };
    }>({
      path: "memberId",
      select: "name",
    })
    .lean();

  if (!loan) {
    throw new Error("Loan not found.");
  }

  const financialYear = await FinancialYear.findById(loan.financialYearId).select("endDate").lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  const member = loan.memberId;

  return buildLoanLedger({
    _id: loan._id,

    loanNumber: loan.loanNumber,

    memberId: loan.memberId._id,

    memberName: member.name,

    loanType: loan.loanType,

    disbursedAmount: loan.disbursedAmount,

    interestRate: loan.interestRate,

    expectedMonthlyRepayment: loan.expectedMonthlyRepayment,

    disbursedDate: loan.disbursedDate,

    closedDate: loan.closedDate,

    financialYearId: loan.financialYearId,

    financialYearEndDate: toCalendarDate(financialYear.endDate),
  });
}

/**
 * Returns the complete loan
 * passbook.
 */
export const getLoanPassbook = cache(async (loanId: LoanIdInput): Promise<LoanPassbook> => {
  const id = LoanIdSchema.parse(loanId);

  return loadLoanPassbook(id);
});
