import type { LoanPassbook } from "./loan-passbook";

/**
 * Validates the generated loan ledger.
 *
 * Throws an Error if an invalid
 * financial state is detected.
 */
export function validateLoanPassbook(passbook: LoanPassbook): void {
  for (const entry of passbook.entries) {
    if (entry.outstandingPrincipal < 0) {
      throw new Error("Outstanding principal cannot be negative.");
    }

    if (entry.pendingInterest < 0) {
      throw new Error("Pending interest cannot be negative.");
    }

    if (entry.pendingLoanFine < 0) {
      throw new Error("Pending loan fine cannot be negative.");
    }

    if (entry.amountPaid < 0) {
      throw new Error("Payment amount cannot be negative.");
    }

    if (entry.paidPrincipal < 0 || entry.paidInterest < 0 || entry.paidLoanFine < 0) {
      throw new Error("Allocated payment cannot be negative.");
    }

    const allocated =
      entry.paidPrincipal + entry.paidInterest + entry.paidLoanFine + entry.remainingAmount;

    if (Math.abs(allocated - entry.amountPaid) > 0.01) {
      throw new Error(`Payment allocation mismatch on ${entry.transactionDate.toISOString()}.`);
    }
  }
}
