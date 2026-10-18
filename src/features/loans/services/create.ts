import { Types } from "mongoose";

import { FINANCIAL_YEAR_STATUS } from "@/features/financial-year/domain/financial-year-status";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import { toCalendarDate } from "@/lib/utils/date";

import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";
import Member from "@/models/Member";

import { DEFAULT_LOAN_INTEREST_RATE } from "../domain/loan-constants";
import { getMinimumMonthlyRepayment } from "../domain/minimum-monthly-repayment";

import type { LoanDetails } from "../types";

import { CreateLoanInput, CreateLoanSchema } from "../validation";

import { validateLoanEligibility } from "./validate-eligibility";

import { generateNextLoanNumber } from "./generate-loan-number";
import { getLoan } from "./get";

export async function createLoan(input: CreateLoanInput): Promise<LoanDetails> {
  await connectMongo();

  const data = CreateLoanSchema.parse(input);

  const [financialYear, member] = await Promise.all([
    FinancialYear.findById(data.financialYearId),

    Member.findById(data.memberId),
  ]);

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  if (financialYear.status !== FINANCIAL_YEAR_STATUS.IN_PROGRESS) {
    throw new Error("Loans can only be created while the financial year is in progress.");
  }

  if (!member) {
    throw new Error("Member not found.");
  }

  const isMemberInYear = financialYear.members.some(
    (entry) => entry.memberId.toString() === data.memberId,
  );

  if (!isMemberInYear) {
    throw new Error("Member is not enrolled in this financial year.");
  }

  await validateLoanEligibility({
    memberId: data.memberId,
    loanType: data.loanType,
  });

  const expectedMonthlyRepayment =
    data.expectedMonthlyRepayment ?? getMinimumMonthlyRepayment(data.disbursedAmount);

  const loan = await createWithNextLoanNumber({
    financialYearId: data.financialYearId,
    values: {
      financialYearId: financialYear._id,
      meetingId: data.meetingId ? new Types.ObjectId(data.meetingId) : null,
      memberId: member._id,
      loanType: data.loanType,
      status: "ACTIVE",
      sanctionedAmount: data.sanctionedAmount,
      disbursedAmount: data.disbursedAmount,
      interestRate: data.interestRate ?? DEFAULT_LOAN_INTEREST_RATE,
      expectedMonthlyRepayment,
      sanctionedDate: toCalendarDate(data.sanctionedDate),
      disbursedDate: toCalendarDate(data.disbursedDate),
      expiryDate: data.expiryDate ? toCalendarDate(data.expiryDate) : null,
      remarks: data.remarks,
    },
  });

  const { revalidateLoans } = await import("@/lib/cache");
  revalidateLoans();

  return getLoan(loan._id.toString());
}

async function createWithNextLoanNumber(input: {
  financialYearId: string;
  values: Record<string, unknown>;
}) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { loanNumber, sequenceNumber } = await generateNextLoanNumber(input.financialYearId);

    try {
      return await Loan.create({
        ...input.values,
        loanNumber,
        sequenceNumber,
      });
    } catch (error) {
      if (attempt === 2 || !isDuplicateLoanNumber(error)) {
        if (isDuplicateLoanNumber(error)) {
          throw new AppError("A loan with this number already exists. Try again.", 409);
        }

        throw error;
      }
    }
  }

  throw new AppError("A loan with this number already exists. Try again.", 409);
}

function isDuplicateLoanNumber(error: unknown) {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  const duplicate = error as { code?: number; keyPattern?: { loanNumber?: unknown } };

  return duplicate.code === 11000 && duplicate.keyPattern?.loanNumber != null;
}
