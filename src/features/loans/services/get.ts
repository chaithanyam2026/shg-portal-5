import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";
import Member from "@/models/Member";

import { toIsoString } from "@/lib/utils/date";

import type { LoanDetails } from "../types";

import { LoanIdInput, LoanIdSchema } from "../validation";

import {
  buildFineWaiverSnapshot,
  calculateLoanCloseTotal,
  calculateLoanSummary,
  canCloseLoan,
  canUpdateExpectedMonthlyRepayment,
} from "../domain";
import { getLoanPassbook } from "./get-passbook";
import { getLoanMemberCloseBalances } from "./internal/get-loan-member-close-balances";

/**
 * Returns complete loan details.
 *
 * Static information comes from the
 * Loan document while financial
 * information is derived from the
 * Loan Summary.
 */
export async function getLoan(loanId: LoanIdInput): Promise<LoanDetails> {
  await connectMongo();

  const id = LoanIdSchema.parse(loanId);

  const loan = await Loan.findById(id).lean();

  if (!loan) {
    throw new Error("Loan not found.");
  }

  const [financialYear, member, passbook, memberCloseBalances] = await Promise.all([
    FinancialYear.findById(loan.financialYearId).select("name status").lean(),

    Member.findById(loan.memberId)
      .select({
        memberCode: 1,
        name: 1,
      })
      .lean(),

    getLoanPassbook(id),

    getLoanMemberCloseBalances(loan.memberId.toString(), loan.financialYearId.toString()),
  ]);

  if (!financialYear || !member) {
    throw new Error("Loan references are invalid.");
  }

  const summary = calculateLoanSummary(passbook);
  const fineWaiver = buildFineWaiverSnapshot(passbook);

  return {
    _id: loan._id.toString(),

    loanNumber: loan.loanNumber,

    loanType: loan.loanType,

    status: loan.status,

    financialYearId: loan.financialYearId.toString(),

    financialYearName: financialYear.name,

    financialYearStatus: financialYear.status,

    memberId: loan.memberId.toString(),

    memberCode: member.memberCode,

    memberName: member.name,

    sanctionedAmount: loan.sanctionedAmount,

    disbursedAmount: loan.disbursedAmount,

    interestRate: loan.interestRate,

    expectedMonthlyRepayment: loan.expectedMonthlyRepayment,

    sanctionedDate:
      toIsoString(loan.sanctionedDate) ?? toIsoString(loan.disbursedDate) ?? "",

    disbursedDate: toIsoString(loan.disbursedDate) ?? "",

    closedDate: toIsoString(loan.closedDate),

    expiryDate: toIsoString(loan.expiryDate),

    remarks: loan.remarks ?? "",

    outstandingPrincipal: summary.outstandingPrincipal,

    paidPrincipal: summary.paidPrincipal,

    paidInterest: summary.paidInterest,

    pendingInterest: summary.pendingInterest,

    paidLoanFine: summary.paidLoanFine,

    pendingLoanFine: summary.pendingLoanFine,

    totalPayable: summary.totalPayable,

    effectiveInterestPercentage: summary.effectiveInterestPercentage,

    effectiveInterestWithFinesPercentage: summary.effectiveInterestWithFinesPercentage,

    isClosable: summary.isClosable,

    canBeClosed: canCloseLoan({
      loanStatus: loan.status,
      financialYearStatus: financialYear.status,
      isClosable: summary.isClosable,
    }),

    canUpdateExpectedMonthlyRepayment: canUpdateExpectedMonthlyRepayment({
      loanStatus: loan.status,
      financialYearStatus: financialYear.status,
    }),

    pendingAbsentFine: memberCloseBalances.pendingAbsentFine,

    pendingContribution: memberCloseBalances.pendingContribution,

    closeTotal: calculateLoanCloseTotal({
      outstandingPrincipal: summary.outstandingPrincipal,
      pendingInterest: summary.pendingInterest,
      pendingLoanFine: summary.pendingLoanFine,
      pendingAbsentFine: memberCloseBalances.pendingAbsentFine,
      pendingContribution: memberCloseBalances.pendingContribution,
    }),

    fineWaiver,
  };
}
