import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";

import type {
  LoanPassbook,
} from "../domain";

import {
  LoanIdInput,
  LoanIdSchema,
} from "../validation";

import {
  buildLoanLedger,
} from "./internal/loan-ledger";

/**
 * Returns the complete loan
 * passbook.
 */
export async function getLoanPassbook(
  loanId: LoanIdInput,
): Promise<LoanPassbook> {
  await connectMongo();

  const id =
    LoanIdSchema.parse(
      loanId,
    );

  const loan =
    await Loan.findById(id)
      .populate({
        path: "memberId",
        select: "name",
      })
      .lean();

  if (!loan) {
    throw new Error(
      "Loan not found.",
    );
  }

const member =
  loan.memberId as {
    _id: unknown;
    name: string;
  };

return buildLoanLedger({
  _id: loan._id,

  loanNumber:
    loan.loanNumber,

  memberId: loan.memberId._id,

  memberName:
    member.name,

  loanType:
    loan.loanType,

  disbursedAmount:
    loan.disbursedAmount,

  interestRate:
    loan.interestRate,

  expectedMonthlyRepayment:
    loan.expectedMonthlyRepayment,

  disbursedDate:
    loan.disbursedDate,
});
}