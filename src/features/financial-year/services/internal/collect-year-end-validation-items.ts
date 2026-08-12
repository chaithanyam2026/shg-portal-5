import { Types, type QueryFilter } from "mongoose";

import Loan, { type LoanDocument } from "@/models/Loan";
import Meeting, { type MeetingDocument } from "@/models/Meeting";

import type { ClosingValidationItem } from "../../domain";

type FinancialYearSnapshot = {
  _id: Types.ObjectId;
  openingBalances?: {
    bankBalance: number;
    cashInHand: number;
    excessCorpus: number;
    investments: number;
    otherLoans: number;
  } | null;
};

export async function collectYearEndValidationItems(
  financialYear: FinancialYearSnapshot,
): Promise<ClosingValidationItem[]> {
  const financialYearObjectId = financialYear._id;

  const openMeetings = await Meeting.countDocuments({
    financialYearId: financialYearObjectId,
    status: {
      $ne: "CLOSED",
    },
  } as unknown as QueryFilter<MeetingDocument>);

  const draftLoans = await Loan.countDocuments({
    financialYearId: financialYearObjectId,
    status: "DRAFT",
  } as unknown as QueryFilter<LoanDocument>);

  const openingBalances = financialYear.openingBalances ?? {
    bankBalance: 0,
    cashInHand: 0,
    excessCorpus: 0,
    investments: 0,
    otherLoans: 0,
  };

  return [
    {
      code: "MEETINGS_CLOSED",
      title: "Meetings Closed",
      valid: openMeetings === 0,
      message: openMeetings === 0 ? "OK" : `${openMeetings} meeting(s) are still open.`,
    },
    {
      code: "LOANS_APPROVED",
      title: "Loans Approved",
      valid: draftLoans === 0,
      message: draftLoans === 0 ? "OK" : `${draftLoans} draft loan(s) found.`,
    },
    {
      code: "CASH_VALID",
      title: "Cash Balance",
      valid: openingBalances.cashInHand >= 0,
      message: openingBalances.cashInHand >= 0 ? "OK" : "Cash balance is negative.",
    },
    {
      code: "BANK_VALID",
      title: "Bank Balance",
      valid: openingBalances.bankBalance >= 0,
      message: openingBalances.bankBalance >= 0 ? "OK" : "Bank balance is negative.",
    },
  ];
}
