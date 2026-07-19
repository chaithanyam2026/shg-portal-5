import { Types, type QueryFilter } from "mongoose";

import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";
import Loan, { type LoanDocument } from "@/models/Loan";
import Meeting, { type MeetingDocument } from "@/models/Meeting";

import type { ClosingValidation, ClosingValidationItem } from "../../domain";
import type { FinancialYearClosingMember } from "@/models/FinancialYear";

import { buildClosingBalances } from "./build-closing-balances";

/**
 * Validates whether a financial
 * year can be closed.
 */
export async function validateFinancialYearClose(
  financialYearId: string,
): Promise<ClosingValidation> {
  await connectMongo();

  const items: ClosingValidationItem[] = [];

  const financialYearObjectId = new Types.ObjectId(financialYearId);

  const financialYear = await FinancialYear.findById(financialYearObjectId).lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  items.push({
    code: "FINANCIAL_YEAR_APPROVED",
    title: "Financial Year Approved",
    valid: financialYear.status === "APPROVED",
    message:
      financialYear.status === "APPROVED"
        ? "OK"
        : "Financial year must be APPROVED before closing.",
  });

  const openMeetings = await Meeting.countDocuments({
    financialYearId: financialYearObjectId,
    status: {
      $ne: "CLOSED",
    },
  } as unknown as QueryFilter<MeetingDocument>);

  items.push({
    code: "MEETINGS_CLOSED",
    title: "Meetings Closed",
    valid: openMeetings === 0,
    message: openMeetings === 0 ? "OK" : `${openMeetings} meeting(s) are still open.`,
  });

  const draftLoans = await Loan.countDocuments({
    financialYearId: financialYearObjectId,
    status: "DRAFT",
  } as unknown as QueryFilter<LoanDocument>);

  items.push({
    code: "LOANS_APPROVED",
    title: "Loans Approved",
    valid: draftLoans === 0,
    message: draftLoans === 0 ? "OK" : `${draftLoans} draft loan(s) found.`,
  });

  const openingBalances = financialYear.openingBalances ?? {
    bankBalance: 0,
    cashInHand: 0,
    excessCorpus: 0,
    investments: 0,
    otherLoans: 0,
  };

  const memberBalances: FinancialYearClosingMember[] = financialYear.members.map((member) => {
    const loanOutstanding = member.opening.loan;
    const specialLoanOutstanding = member.opening.specialLoan;
    const attendanceFineOutstanding = 0;
    const loanFineOutstanding = 0;

    return {
      memberId: member.memberId,
      memberCode: "",
      memberName: "",
      savingsBalance: member.opening.contribution,
      loanOutstanding,
      specialLoanOutstanding,
      attendanceFineOutstanding,
      loanFineOutstanding,
      totalOutstanding:
        loanOutstanding +
        specialLoanOutstanding +
        attendanceFineOutstanding +
        loanFineOutstanding,
    };
  });

  const balances = buildClosingBalances({
    bankBalance: openingBalances.bankBalance,
    cashInHand: openingBalances.cashInHand,
    excessCorpus: openingBalances.excessCorpus,
    investments: openingBalances.investments,
    memberBalances,
  });

  items.push({
    code: "CASH_VALID",
    title: "Cash Balance",
    valid: balances.cashInHand >= 0,
    message: balances.cashInHand >= 0 ? "OK" : "Cash balance is negative.",
  });

  items.push({
    code: "BANK_VALID",
    title: "Bank Balance",
    valid: balances.bankBalance >= 0,
    message: balances.bankBalance >= 0 ? "OK" : "Bank balance is negative.",
  });

  items.push({
    code: "BALANCES_MATCH",
    title: "Closing Balances",
    valid: balances.totalAssets >= balances.totalLiabilities,
    message:
      balances.totalAssets >= balances.totalLiabilities
        ? "OK"
        : "Assets are less than liabilities.",
  });

  return {
    valid: items.every((item) => item.valid),
    items,
  };
}
