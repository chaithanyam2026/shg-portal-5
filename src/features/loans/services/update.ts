import { FINANCIAL_YEAR_STATUS } from "@/features/financial-year/domain/financial-year-status";
import { isFinancialYearOfficeBearer } from "@/features/financial-year/domain/office-bearers";
import connectMongo from "@/lib/db/mongodb";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import { compareCalendarDates, toCalendarDate } from "@/lib/utils/date";

import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";

import { CLOSED_LOAN_STATUS } from "../domain/loan-status";
import { canUpdateExpectedMonthlyRepayment } from "../domain/loan-rules";
import type { LoanDetails } from "../types";

import { ObjectIdSchema, type UpdateLoanInput, UpdateLoanSchema } from "../validation";
import { ensureLoanSanctionedDate } from "./internal/ensure-loan-sanctioned-date";
import { getLoan } from "./get";

export async function updateLoan(loanId: string, input: UpdateLoanInput): Promise<LoanDetails> {
  await connectMongo();

  const id = ObjectIdSchema.parse(loanId);

  const data = UpdateLoanSchema.parse(input);

  const loan = await Loan.findById(id);

  if (!loan) {
    throw new Error("Loan not found.");
  }

  if (data.remarks !== undefined) {
    loan.remarks = data.remarks;
  }

  if (data.status) {
    loan.status = data.status;
  }

  if (data.closedDate !== undefined) {
    if (loan.status !== CLOSED_LOAN_STATUS && data.status !== CLOSED_LOAN_STATUS) {
      throw new Error("Close date can only be set on a closed loan.");
    }

    if (data.closedDate && compareCalendarDates(data.closedDate, loan.disbursedDate) < 0) {
      throw new Error("Close date cannot be before the loan start date.");
    }

    loan.closedDate = data.closedDate ? toCalendarDate(data.closedDate) : null;
  }

  if (data.expectedMonthlyRepayment !== undefined) {
    const financialYear = await FinancialYear.findById(loan.financialYearId)
      .select("status executiveCommittee")
      .lean();
    const memberId = await getCurrentMemberId();

    if (
      !canUpdateExpectedMonthlyRepayment({
        loanStatus: loan.status,
        financialYearStatus: financialYear?.status ?? FINANCIAL_YEAR_STATUS.CLOSED,
        isOfficeBearer: isFinancialYearOfficeBearer(financialYear?.executiveCommittee, memberId),
      })
    ) {
      throw new Error(
        "Minimum monthly repayment can only be changed by the president, secretary, or treasurer of an in-progress financial year.",
      );
    }

    if (data.expectedMonthlyRepayment > loan.disbursedAmount) {
      throw new Error("Minimum monthly repayment cannot exceed the disbursed amount.");
    }

    loan.expectedMonthlyRepayment = data.expectedMonthlyRepayment;
  }

  ensureLoanSanctionedDate(loan);

  await loan.save();

  const { revalidateLoans } = await import("@/lib/cache");
  revalidateLoans();

  return getLoan(id);
}
