import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";

import type { LoanDetails, UpdateLoanInput } from "../types";

import { ObjectIdSchema, UpdateLoanSchema } from "../validation";

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

  if (data.status !== undefined) {
    loan.status = data.status;

    loan.closedAt = data.status === "CLOSED" ? new Date() : null;
  }

  await loan.save();

  const financialYear = loan.financialYearId as {
    _id: { toString(): string };
    name: string;
  };

  const member = loan.memberId as {
    _id: { toString(): string };
    memberCode: string;
    name: string;
  };

  return {
    _id: loan._id.toString(),

    financialYearId: financialYear._id.toString(),

    financialYearName: financialYear.name,

    memberId: member._id.toString(),

    memberCode: member.memberCode,

    memberName: member.name,

    loanNumber: loan.loanNumber,

    disbursedDate: loan.disbursedDate.toISOString(),

    loanAmount: loan.loanAmount,

    interestRate: loan.interestRate,

    expectedMonthlyRepayment: loan.expectedMonthlyRepayment,

    outstandingPrincipal: loan.outstandingPrincipal,

    paidInterest: loan.paidInterest,

    pendingInterest: loan.pendingInterest,

    paidLoanFine: loan.paidLoanFine,

    pendingLoanFine: loan.pendingLoanFine,

    lastInterestCalculatedAt: loan.lastInterestCalculatedAt.toISOString(),

    lastFineCalculatedMonth: loan.lastFineCalculatedMonth,

    remarks: loan.remarks,

    status: loan.status,

    closedAt: loan.closedAt ? loan.closedAt.toISOString() : null,

    createdBy: loan.createdBy ? loan.createdBy.toString() : null,

    updatedBy: loan.updatedBy ? loan.updatedBy.toString() : null,
  };
}
