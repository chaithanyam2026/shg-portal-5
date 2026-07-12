/**
 * Payment allocation input.
 */
export type PaymentAllocationInput = {
  /**
   * Total payment received.
   */
  payment: number;

  /**
   * Outstanding loan principal.
   */
  outstandingPrincipal: number;

  /**
   * Pending interest.
   */
  outstandingInterest: number;

  /**
   * Pending loan fine.
   */
  outstandingFine: number;
};

/**
 * Payment allocation result.
 *
 * Payment order:
 *
 * 1. Loan Fine
 * 2. Interest
 * 3. Principal
 */
export type PaymentAllocation = {
  /**
   * Principal repaid.
   */
  paidPrincipal: number;

  /**
   * Interest paid.
   */
  paidInterest: number;

  /**
   * Loan fine paid.
   */
  paidLoanFine: number;

  /**
   * Remaining unallocated amount.
   */
  remainingAmount: number;

  /**
   * Backward compatibility.
   */
  principal: number;

  interest: number;

  fine: number;

  remaining: number;
};

/**
 * Allocates payment.
 *
 * Allocation order:
 *
 * Loan Fine
 * ↓
 * Interest
 * ↓
 * Principal
 */
export function allocateLoanPayment(
  input: PaymentAllocationInput,
): PaymentAllocation {
  let remaining =
    input.payment;

  const paidLoanFine =
    Math.min(
      remaining,
      input.outstandingFine,
    );

  remaining -=
    paidLoanFine;

  const paidInterest =
    Math.min(
      remaining,
      input.outstandingInterest,
    );

  remaining -=
    paidInterest;

  const paidPrincipal =
    Math.min(
      remaining,
      input.outstandingPrincipal,
    );

  remaining -=
    paidPrincipal;

  return {
    paidPrincipal,

    paidInterest,

    paidLoanFine,

    remainingAmount:
      remaining,

    /**
     * Backward compatibility.
     */
    principal:
      paidPrincipal,

    interest:
      paidInterest,

    fine:
      paidLoanFine,

    remaining,
  };
}

/**
 * Backward compatibility alias.
 */
export const allocatePayment =
  allocateLoanPayment;