import type { FinancialYearStatus } from "@/features/financial-year/domain/financial-year-status";

import type { LoanStatus } from "./domain/loan-status";

import type { LoanType } from "./domain/loan-type";

import type { FineWaiverSnapshot } from "./domain/fine-waiver-payment";

/**
 * Common loan information shared by
 * list and detail views.
 */
export type LoanBase = {
  _id: string;

  loanNumber: string;

  loanType: LoanType;

  status: LoanStatus;

  financialYearId: string;

  financialYearName: string;

  memberId: string;

  memberCode: string;

  memberName: string;

  sanctionedAmount: number;

  disbursedAmount: number;

  interestRate: number;

  expectedMonthlyRepayment: number;

  sanctionedDate: string;

  disbursedDate: string;

  expiryDate: string | null;
};

/**
 * Used in dropdowns and lookups.
 */
export type LoanLookup = Pick<
  LoanBase,
  "_id" | "loanNumber" | "loanType" | "memberId" | "memberCode" | "memberName" | "status"
>;

/**
 * Used by the loan list page.
 */
export type LoanSummary = LoanBase & {
  outstandingPrincipal: number;

  totalPayable: number;
};

/**
 * Filters used by the loan list.
 */
export type LoanListFilters = {
  search: string;

  financialYearId: string;

  loanType: LoanType | "";

  status: LoanStatus | "";
};

/**
 * Complete loan details used by
 * the Loan Details page.
 */
export type LoanDetails = LoanBase & {
  financialYearStatus: FinancialYearStatus;

  remarks: string;

  outstandingPrincipal: number;

  paidPrincipal: number;

  paidInterest: number;

  pendingInterest: number;

  paidLoanFine: number;

  pendingLoanFine: number;

  totalPayable: number;

  effectiveInterestPercentage: number;

  effectiveInterestWithFinesPercentage: number;

  isClosable: boolean;

  canBeClosed: boolean;

  pendingAbsentFine: number;

  pendingContribution: number;

  closeTotal: number;

  fineWaiver: FineWaiverSnapshot;
};

/**
 * Computed loan summary.
 *
 * Generated from the loan ledger and
 * meeting repayments.
 */
export type LoanSummaryResult = {
  outstandingPrincipal: number;

  paidPrincipal: number;

  paidInterest: number;

  pendingInterest: number;

  paidLoanFine: number;

  pendingLoanFine: number;

  totalPayable: number;

  effectiveInterestPercentage: number;

  effectiveInterestWithFinesPercentage: number;

  isClosable: boolean;
};

/**
 * Passbook summary shown above the
 * ledger entries.
 */
export type LoanPassbookSummary = {
  loanId: string;

  loanNumber: string;

  memberName: string;

  outstandingPrincipal: number;

  pendingInterest: number;

  pendingLoanFine: number;

  totalPayable: number;

  lastTransactionDate?: string;

  transactionCount: number;
};
