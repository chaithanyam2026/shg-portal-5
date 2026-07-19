import type { LoanDetails, LoanPassbook } from "../types";

export function buildLoanLedger(loan: LoanDetails): LoanPassbook {
  return {
    entries: [],

    outstandingPrincipal: loan.disbursedAmount,

    outstandingInterest: 0,

    outstandingFine: 0,

    totalOutstanding: loan.disbursedAmount,
  };
}
