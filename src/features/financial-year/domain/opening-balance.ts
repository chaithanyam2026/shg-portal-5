/**
 * Opening balances for the
 * next financial year.
 */
export type OpeningBalance = {
  bankBalance: number;

  cashInHand: number;

  excessCorpus: number;

  investments: number;

  otherLoans: number;
};

/** Bank + cash + investments — the liquid opening account total shown on the summary tab. */
export function getOpeningAccountBalance(opening: OpeningBalance): number {
  return opening.bankBalance + opening.cashInHand + opening.investments;
}
