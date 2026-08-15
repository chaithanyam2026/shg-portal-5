import type { LoanStatus } from "@/features/loans/domain/loan-status";
import type { LoanType } from "@/features/loans/domain/loan-type";

export type LoanRegisterTotals = {
  count: number;
  disbursedAmount: number;
  paidPrincipal: number;
  paidInterest: number;
  paidLoanFine: number;
  outstandingPrincipal: number;
  pendingInterest: number;
  pendingLoanFine: number;
  totalOutstanding: number;
};

export type LoanRegisterRow = {
  loanId: string;
  loanNumber: string;
  memberId: string;
  memberCode: string;
  memberName: string;
  loanType: LoanType;
  status: LoanStatus;
  disbursedDate: string;
  expiryDate: string | null;
  disbursedAmount: number;
  interestRate: number;
  paidPrincipal: number;
  paidInterest: number;
  paidLoanFine: number;
  outstandingPrincipal: number;
  pendingInterest: number;
  pendingLoanFine: number;
  totalOutstanding: number;
};

export type LoanRegisterGroup = {
  loanType: LoanType;
  label: string;
  rows: LoanRegisterRow[];
  totals: LoanRegisterTotals;
};

export type LoanRegister = {
  financialYearId: string;
  groups: LoanRegisterGroup[];
  totals: LoanRegisterTotals;
};
