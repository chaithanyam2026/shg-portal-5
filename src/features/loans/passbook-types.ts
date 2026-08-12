export type LoanPassbookEntry = {
  transactionDate: string;

  meetingId: string;

  meetingDate: string;

  amountPaid: number;

  loanFine: number;

  interestDays: number;

  interest: number;

  paidInterest: number;

  paidLoanFine: number;

  paidPrincipal: number;

  pendingInterest: number;

  pendingLoanFine: number;

  outstandingPrincipal: number;
};

export type LoanPassbook = {
  loanId: string;

  loanNumber: string;

  memberId: string;

  memberName: string;

  loanAmount: number;

  disbursedDate: string;

  interestRate: number;

  expectedMonthlyRepayment: number;

  entries: LoanPassbookEntry[];
};

export type LoanSummary = {
  loanId: string;

  loanNumber: string;

  loanAmount: number;

  disbursedDate: string;

  interestRate: number;

  expectedMonthlyRepayment: number;

  outstandingPrincipal: number;

  paidInterest: number;

  pendingInterest: number;

  paidLoanFine: number;

  pendingLoanFine: number;

  totalPayable: number;

  effectiveInterestPercentage: number;

  status: string;
};

export type MonthlyLoanFine = {
  month: string;

  expectedRepayment: number;

  actualRepayment: number;

  fineAmount: number;

  applied: boolean;
};
