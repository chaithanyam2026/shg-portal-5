import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";

import type { LoanPassbook } from "../domain";

import { LoanIdInput, LoanIdSchema } from "../validation";

import { buildLoanLedger } from "./internal/loan-ledger";
import { Types } from "mongoose";

/**
 * Returns the complete loan
 * passbook.
 */
export async function getLoanPassbook(loanId: LoanIdInput): Promise<LoanPassbook> {
  await connectMongo();

  const id = LoanIdSchema.parse(loanId);

  const loan = await Loan.findById(id)
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
  });
}
