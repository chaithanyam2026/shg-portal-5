import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";
import FinancialYear from "@/models/FinancialYear";
import Member from "@/models/Member";

import type {
  LoanDetails,
} from "../types";

import {
  LoanIdInput,
  LoanIdSchema,
} from "../validation";

import {
  getLoanSummary,
} from "./summary";

/**
 * Returns complete loan details.
 *
 * Static information comes from the
 * Loan document while financial
 * information is derived from the
 * Loan Summary.
 */
export async function getLoan(
  loanId: LoanIdInput,
): Promise<LoanDetails> {
  await connectMongo();

  const id =
    LoanIdSchema.parse(
      loanId,
    );

  const loan =
    await Loan.findById(id)
      .lean();

  if (!loan) {
    throw new Error(
      "Loan not found.",
    );
  }

  const [
    financialYear,
    member,
    summary,
  ] = await Promise.all([
    FinancialYear.findById(
      loan.financialYearId,
    )
      .select("name")
      .lean(),

    Member.findById(
      loan.memberId,
    )
      .select({
        memberCode: 1,
        name: 1,
      })
      .lean(),

    getLoanSummary(id),
  ]);

  if (
    !financialYear ||
    !member
  ) {
    throw new Error(
      "Loan references are invalid.",
    );
  }

  return {
    _id:
      loan._id.toString(),

    loanNumber:
      loan.loanNumber,

    loanType:
      loan.loanType,

    status:
      loan.status,

    financialYearId:
      loan.financialYearId.toString(),

    financialYearName:
      financialYear.name,

    memberId:
      loan.memberId.toString(),

    memberCode:
      member.memberCode,

    memberName:
      member.name,

    sanctionedAmount:
      loan.sanctionedAmount,

    disbursedAmount:
      loan.disbursedAmount,

    interestRate:
      loan.interestRate,

    expectedMonthlyRepayment:
      loan.expectedMonthlyRepayment,

    disbursedDate:
      loan.disbursedDate.toISOString(),

    remarks:
      loan.remarks ?? "",

    outstandingPrincipal:
      summary.outstandingPrincipal,

    paidPrincipal:
      summary.paidPrincipal,

    paidInterest:
      summary.paidInterest,

    pendingInterest:
      summary.pendingInterest,

    paidLoanFine:
      summary.paidLoanFine,

    pendingLoanFine:
      summary.pendingLoanFine,

    totalPayable:
      summary.totalPayable,

    effectiveInterestPercentage:
      summary.effectiveInterestPercentage,

    isClosable:
      summary.isClosable,
  };
}