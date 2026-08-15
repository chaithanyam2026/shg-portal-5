import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";

import {
  calculateLoanSummary,
  canCloseLoan,
  CLOSED_LOAN_STATUS,
  formatLoanClosingRemark,
} from "../domain";
import type { LoanDetails } from "../types";
import { CloseLoanSchema, LoanIdSchema } from "../validation";
import { ensureLoanSanctionedDate } from "./internal/ensure-loan-sanctioned-date";
import { getLoan } from "./get";
import { getLoanPassbook } from "./get-passbook";

export async function closeLoan(loanId: string, input: unknown): Promise<LoanDetails> {
  await connectMongo();

  const id = LoanIdSchema.parse(loanId);
  const { comment } = CloseLoanSchema.parse(input);

  const loan = await Loan.findById(id);

  if (!loan) {
    throw new AppError("Loan not found.", 404);
  }

  const financialYear = await FinancialYear.findById(loan.financialYearId).select("status").lean();

  if (!financialYear) {
    throw new AppError("Financial year not found.", 404);
  }

  const passbook = await getLoanPassbook(id);
  const summary = calculateLoanSummary(passbook);

  if (
    !canCloseLoan({
      loanStatus: loan.status,
      financialYearStatus: financialYear.status,
      isClosable: summary.isClosable,
    })
  ) {
    throw new AppError(
      "Loan cannot be closed. Repay all outstanding amounts or wait until the financial year is approved.",
      400,
    );
  }

  const closingRemark = formatLoanClosingRemark(comment);

  loan.remarks = loan.remarks.trim() ? `${loan.remarks.trim()}\n${closingRemark}` : closingRemark;
  loan.status = CLOSED_LOAN_STATUS;
  ensureLoanSanctionedDate(loan);

  await loan.save();

  return getLoan(id);
}
