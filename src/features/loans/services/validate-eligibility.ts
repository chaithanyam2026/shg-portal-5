import Loan from "@/models/Loan";

import { ACTIVE_LOAN_STATUS } from "../domain/loan-status";

import type { LoanType } from "../domain/loan-type";

type ValidateLoanEligibilityInput = {
  memberId: string;

  loanType: LoanType;
};

export async function validateLoanEligibility({
  memberId,
  loanType,
}: ValidateLoanEligibilityInput): Promise<void> {
  const activeLoan = await Loan.findOne({
    memberId,

    loanType,

    status: ACTIVE_LOAN_STATUS,
  })
    .select({
      loanNumber: 1,
    })
    .lean();

  if (!activeLoan) {
    return;
  }

  const loanTypeLabel = loanType === "NORMAL" ? "normal" : "special";

  throw new Error(`Member already has an active ${loanTypeLabel} loan (${activeLoan.loanNumber}).`);
}
