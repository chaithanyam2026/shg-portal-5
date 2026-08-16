import { isFinancialYearOfficeBearer } from "@/features/financial-year/domain/office-bearers";
import { auth } from "@/auth";
import connectMongo from "@/lib/db/mongodb";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import { isAdminRole } from "@/lib/auth/roles";
import { AppError } from "@/lib/errors";
import { compareCalendarDates, toCalendarDate } from "@/lib/utils/date";
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
  const { comment, closedDate } = CloseLoanSchema.parse(input);

  const loan = await Loan.findById(id);

  if (!loan) {
    throw new AppError("Loan not found.", 404);
  }

  const financialYear = await FinancialYear.findById(loan.financialYearId)
    .select("status endDate executiveCommittee")
    .lean();

  if (!financialYear) {
    throw new AppError("Financial year not found.", 404);
  }

  const passbook = await getLoanPassbook(id);
  const summary = calculateLoanSummary(passbook);
  const [actorMemberId, session] = await Promise.all([getCurrentMemberId(), auth()]);

  if (
    !canCloseLoan({
      loanStatus: loan.status,
      isClosable: summary.isClosable,
      financialYearEndDate: financialYear.endDate,
      isOfficeBearer: isFinancialYearOfficeBearer(
        financialYear.executiveCommittee,
        actorMemberId,
      ),
      isAdmin: isAdminRole(session?.user?.role),
    })
  ) {
    throw new AppError(
      "Loan cannot be closed. Repay all outstanding amounts, or wait until the financial year end date has passed and close it as president, secretary, treasurer, or administrator.",
      400,
    );
  }

  if (compareCalendarDates(closedDate, loan.disbursedDate) < 0) {
    throw new AppError("Close date cannot be before the loan start date.", 400);
  }

  const closingRemark = formatLoanClosingRemark(comment);

  loan.remarks = loan.remarks.trim() ? `${loan.remarks.trim()}\n${closingRemark}` : closingRemark;
  loan.status = CLOSED_LOAN_STATUS;
  loan.closedDate = toCalendarDate(closedDate);
  ensureLoanSanctionedDate(loan);

  await loan.save();

  const { revalidateLoans } = await import("@/lib/cache");
  revalidateLoans();

  return getLoan(id);
}
