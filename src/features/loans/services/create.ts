import { Types } from "mongoose";

import { FINANCIAL_YEAR_STATUS } from "@/features/financial-year/domain/financial-year-status";
import connectMongo from "@/lib/db/mongodb";

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

  const { loanNumber, sequenceNumber } = await generateNextLoanNumber(data.financialYearId);

  const expectedMonthlyRepayment =
    data.expectedMonthlyRepayment ?? getMinimumMonthlyRepayment(data.disbursedAmount);

  const loan = await Loan.create({
    loanNumber,

    sequenceNumber,

    financialYearId: financialYear._id,

    meetingId: data.meetingId ? new Types.ObjectId(data.meetingId) : null,

    memberId: member._id,

    loanType: data.loanType,

    status: "ACTIVE",

    sanctionedAmount: data.sanctionedAmount,

    disbursedAmount: data.disbursedAmount,

    interestRate: data.interestRate ?? DEFAULT_LOAN_INTEREST_RATE,

    expectedMonthlyRepayment,

    sanctionedDate: data.sanctionedDate,

    disbursedDate: data.disbursedDate,

    expiryDate: data.expiryDate ?? null,

    remarks: data.remarks,
  });

  return getLoan(loan._id.toString());
}
