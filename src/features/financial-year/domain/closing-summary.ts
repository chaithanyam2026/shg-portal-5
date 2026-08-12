/**
 * SHG closing balances.
 */
export type ClosingSummary = {
  cashInHand: number;

  bankBalance: number;

  investments: number;

  excessCorpus: number;

  savingsBalance: number;

  loanOutstanding: number;

  specialLoanOutstanding: number;

  attendanceFineOutstanding: number;

  loanFineOutstanding: number;

  totalAssets: number;

  totalLiabilities: number;
};
