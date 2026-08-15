import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";

import type { LoanDetails } from "../types";

import { ObjectIdSchema, type UpdateLoanInput, UpdateLoanSchema } from "../validation";
import { ensureLoanSanctionedDate } from "./internal/ensure-loan-sanctioned-date";
import { getLoan } from "./get";

export async function updateLoan(loanId: string, input: UpdateLoanInput): Promise<LoanDetails> {
  await connectMongo();

  const id = ObjectIdSchema.parse(loanId);

  const data = UpdateLoanSchema.parse(input);

  const loan = await Loan.findById(id)
    .populate({
      path: "financialYearId",
      select: "name",
    })
    .populate({
      path: "memberId",
      select: "memberCode name",
    });

  if (!loan) {
    throw new Error("Loan not found.");
  }

  if (data.remarks !== undefined) {
    loan.remarks = data.remarks;
  }

  if (data.status) {
    loan.status = data.status;
  }

  ensureLoanSanctionedDate(loan);

  await loan.save();

  return getLoan(id);
}
