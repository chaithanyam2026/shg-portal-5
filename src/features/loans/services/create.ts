import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";
import Member from "@/models/Member";

import type { LoanDetails } from "../types";

import { CreateLoanInput, CreateLoanSchema } from "../validation";

import { validateLoanEligibility } from "./validate-eligibility";

import { generateNextLoanNumber } from "./generate-loan-number";

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

  if (!member) {
    throw new Error("Member not found.");
  }

  await validateLoanEligibility({
    memberId: data.memberId,
    loanType: data.loanType,
  });

  const { loanNumber, sequenceNumber } = await generateNextLoanNumber(data.financialYearId);

  const loan = await Loan.create({
    loanNumber,

    sequenceNumber,

    financialYearId: financialYear._id,

    memberId: member._id,

    loanType: data.loanType,

    status: "ACTIVE",

    sanctionedAmount: data.sanctionedAmount,

    disbursedAmount: data.disbursedAmount,

    interestRate: data.interestRate,

    expectedMonthlyRepayment: data.expectedMonthlyRepayment,

    disbursedDate: data.disbursedDate,

    remarks: data.remarks,
  });

  return {
    _id: loan._id.toString(),

    loanNumber: loan.loanNumber,

    loanType: loan.loanType,

    status: loan.status,

    financialYearId: financialYear._id.toString(),

    financialYearName: financialYear.name,

    memberId: member._id.toString(),

    memberCode: member.memberCode,

    memberName: member.name,

    sanctionedAmount: loan.sanctionedAmount,

    disbursedAmount: loan.disbursedAmount,

    interestRate: loan.interestRate,

    expectedMonthlyRepayment: loan.expectedMonthlyRepayment,

    disbursedDate: loan.disbursedDate.toISOString(),

    remarks: loan.remarks,

    outstandingPrincipal: loan.disbursedAmount,

    paidPrincipal: 0,

    paidInterest: 0,

    pendingInterest: 0,

    paidLoanFine: 0,

    pendingLoanFine: 0,

    totalPayable: loan.disbursedAmount,

    effectiveInterestPercentage: 0,

    isClosable: false,
  };
}
