import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";
import Meeting from "@/models/Meeting";

import type { ClosingValidation, ClosingValidationItem } from "../../domain";

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

  const financialYear = await FinancialYear.findById(financialYearId).lean();

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
    financialYearId,
    status: {
      $ne: "CLOSED",
    },
  });

  items.push({
    code: "MEETINGS_CLOSED",
    title: "Meetings Closed",
    valid: openMeetings === 0,
    message: openMeetings === 0 ? "OK" : `${openMeetings} meeting(s) are still open.`,
  });

  const draftLoans = await Loan.countDocuments({
    financialYearId,
    status: "DRAFT",
  });

  items.push({
    code: "LOANS_APPROVED",
    title: "Loans Approved",
    valid: draftLoans === 0,
    message: draftLoans === 0 ? "OK" : `${draftLoans} draft loan(s) found.`,
  });

  const balances = await buildClosingBalances(financialYearId);

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
