import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";

import { AppError } from "@/lib/errors";

import { LoanIdInput, LoanIdSchema } from "../validation";
import {
  getLoanMemberCloseBalances,
  type LoanMemberCloseBalances,
} from "./internal/get-loan-member-close-balances";
import { assertCanViewLoan } from "./internal/loan-access";

/**
 * Pending contribution and absent-fine totals used when closing a loan.
 */
export async function getLoanCloseBalances(loanId: LoanIdInput): Promise<LoanMemberCloseBalances> {
  await connectMongo();

  const id = LoanIdSchema.parse(loanId);

  const loan = await Loan.findById(id).select("memberId financialYearId").lean();

  if (!loan) {
    throw new AppError("Loan not found.", 404);
  }

  await assertCanViewLoan(loan.memberId.toString());

  return getLoanMemberCloseBalances(loan.memberId.toString(), loan.financialYearId.toString());
}
