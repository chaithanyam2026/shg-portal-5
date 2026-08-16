import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/guards";
import Loan from "@/models/Loan";

import { ACTIVE_LOAN_STATUS, canReopenLoan, stripLoanClosingRemarks } from "../domain";
import type { LoanDetails } from "../types";
import { LoanIdSchema } from "../validation";
import { getLoan } from "./get";

export async function reopenLoan(loanId: string): Promise<LoanDetails> {
  await connectMongo();
  await requireRole(ADMIN_ROLES);

  const id = LoanIdSchema.parse(loanId);
  const loan = await Loan.findById(id);

  if (!loan) {
    throw new AppError("Loan not found.", 404);
  }

  if (!canReopenLoan(loan.status)) {
    throw new AppError("Only closed loans can be reopened.", 400);
  }

  loan.status = ACTIVE_LOAN_STATUS;
  loan.closedDate = null;
  loan.remarks = stripLoanClosingRemarks(loan.remarks ?? "");

  await loan.save();

  return getLoan(id);
}
