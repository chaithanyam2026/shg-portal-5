import { cache } from "react";

import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";
import Member from "@/models/Member";

import { auth } from "@/auth";
import { isFinancialYearOfficeBearer } from "@/features/financial-year/domain/office-bearers";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import { isAdminRole } from "@/lib/auth/roles";
import { toIsoString } from "@/lib/utils/date";

import type { LoanPassbook } from "../domain";
import type { LoanDetails, LoanSummaryResult } from "../types";

import { LoanIdInput, LoanIdSchema } from "../validation";

import {
  buildFineWaiverSnapshot,
  calculateLoanCloseTotal,
  calculateLoanSummary,
  canCloseLoan,
  canReopenLoan,
  canUpdateExpectedMonthlyRepayment,
} from "../domain";
import { getLoanPassbook, loadLoanPassbook } from "./get-passbook";
import { assertCanViewLoan } from "./internal/loan-access";

const EMPTY_CLOSE_BALANCES = {
  pendingAbsentFine: 0,
  pendingContribution: 0,
};

export type LoanDetailPageData = {
  loan: LoanDetails;
  summary: LoanSummaryResult;
  passbook: LoanPassbook;
};

async function loadLoanDetailPage(
  loanId: LoanIdInput,
  options: { freshPassbook?: boolean } = {},
): Promise<LoanDetailPageData> {
  await connectMongo();

  const id = LoanIdSchema.parse(loanId);

  const loan = await Loan.findById(id).lean();

  if (!loan) {
    throw new Error("Loan not found.");
  }

  await assertCanViewLoan(loan.memberId.toString());

  const [financialYear, member, passbook] = await Promise.all([
    FinancialYear.findById(loan.financialYearId)
      .select("name status endDate executiveCommittee")
      .lean(),

    Member.findById(loan.memberId)
      .select({
        memberCode: 1,
        name: 1,
      })
      .lean(),

    options.freshPassbook ? loadLoanPassbook(id) : getLoanPassbook(id),
  ]);

  if (!financialYear || !member) {
    throw new Error("Loan references are invalid.");
  }

  const summary = calculateLoanSummary(passbook);
  const fineWaiver = buildFineWaiverSnapshot(passbook);

  const [actorMemberId, session] = await Promise.all([getCurrentMemberId(), auth()]);
  const isOfficeBearer = isFinancialYearOfficeBearer(
    financialYear.executiveCommittee,
    actorMemberId,
  );
  const isAdmin = isAdminRole(session?.user?.role);

  return {
    loan: {
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

      sanctionedDate: toIsoString(loan.sanctionedDate) ?? toIsoString(loan.disbursedDate) ?? "",

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
        isClosable: summary.isClosable,
        financialYearEndDate: financialYear.endDate,
        isOfficeBearer,
        isAdmin,
      }),

      canReopen: canReopenLoan(loan.status) && isAdmin,

      canUpdateExpectedMonthlyRepayment: canUpdateExpectedMonthlyRepayment({
        loanStatus: loan.status,
        financialYearStatus: financialYear.status,
        isOfficeBearer,
      }),

      pendingAbsentFine: EMPTY_CLOSE_BALANCES.pendingAbsentFine,

      pendingContribution: EMPTY_CLOSE_BALANCES.pendingContribution,

      closeTotal: calculateLoanCloseTotal({
        outstandingPrincipal: summary.outstandingPrincipal,
        pendingInterest: summary.pendingInterest,
        pendingLoanFine: summary.pendingLoanFine,
        pendingAbsentFine: EMPTY_CLOSE_BALANCES.pendingAbsentFine,
        pendingContribution: EMPTY_CLOSE_BALANCES.pendingContribution,
      }),

      fineWaiver,
    },
    summary,
    passbook,
  };
}

/**
 * Loan details, summary, and passbook from a single passbook build.
 */
export const getLoanDetailPage = cache((loanId: LoanIdInput) => loadLoanDetailPage(loanId));

/**
 * Returns complete loan details.
 *
 * Static information comes from the
 * Loan document while financial
 * information is derived from the
 * Loan Summary.
 */
export async function getLoan(loanId: LoanIdInput): Promise<LoanDetails> {
  const { loan } = await loadLoanDetailPage(loanId, { freshPassbook: true });

  return loan;
}
