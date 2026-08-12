/**
 * Outstanding balance before payment.
 */
export type OutstandingBalanceInput = {
  outstandingPrincipal: number;

  pendingInterest: number;

  pendingLoanFine: number;

  paidPrincipal: number;

  paidInterest: number;

  paidLoanFine: number;
};

/**
 * Outstanding balance after payment.
 */
export type OutstandingBalance = {
  outstandingPrincipal: number;

  pendingInterest: number;

  pendingLoanFine: number;
};

/**
 * Updates outstanding balances after
 * payment allocation.
 *
 * Outstanding values never become
 * negative.
 */
export function updateOutstandingBalance({
  outstandingPrincipal,
  pendingInterest,
  pendingLoanFine,
  paidPrincipal,
  paidInterest,
  paidLoanFine,
}: OutstandingBalanceInput): OutstandingBalance {
  return {
    outstandingPrincipal: Math.max(outstandingPrincipal - paidPrincipal, 0),

    pendingInterest: Math.max(pendingInterest - paidInterest, 0),

    pendingLoanFine: Math.max(pendingLoanFine - paidLoanFine, 0),
  };
}
