import { LOAN_FINE_ENTRY, LOAN_REPAYMENT_ENTRY } from "./passbook-entry-type";

import type { LoanPassbookEntry } from "./loan-passbook";

/**
 * Input for creating a monthly fine
 * passbook entry.
 */
export type FineLedgerEntryInput = {
  transactionDate: Date;

  description: string;

  interestDays: number;

  interestCharged: number;

  loanFineCharged: number;

  outstandingPrincipal: number;

  pendingInterest: number;

  pendingLoanFine: number;
};

/**
 * Input for creating a repayment
 * passbook entry.
 */
export type LedgerEntryInput = {
  transactionDate: Date;

  meetingId: string;

  description?: string;

  amountPaid: number;

  interestDays: number;

  interestCharged: number;

  loanFineCharged: number;

  paidPrincipal: number;

  paidInterest: number;

  paidLoanFine: number;

  outstandingPrincipal: number;

  pendingInterest: number;

  pendingLoanFine: number;

  remainingAmount: number;
};

/**
 * Creates a monthly fine passbook entry.
 */
export function createFineLedgerEntry({
  transactionDate,
  description,
  interestDays,
  interestCharged,
  loanFineCharged,
  outstandingPrincipal,
  pendingInterest,
  pendingLoanFine,
}: FineLedgerEntryInput): LoanPassbookEntry {
  return {
    transactionDate,

    type: LOAN_FINE_ENTRY,

    description,

    amountPaid: 0,

    interestDays,

    interestCharged,

    loanFineCharged,

    paidInterest: 0,

    paidLoanFine: 0,

    paidPrincipal: 0,

    outstandingPrincipal,

    pendingInterest,

    pendingLoanFine,

    remainingAmount: 0,
  };
}

/**
 * Creates a repayment passbook
 * entry.
 */
export function createLedgerEntry({
  transactionDate,
  meetingId,
  description = "Loan repayment",
  amountPaid,
  interestDays,
  interestCharged,
  loanFineCharged,
  paidPrincipal,
  paidInterest,
  paidLoanFine,
  outstandingPrincipal,
  pendingInterest,
  pendingLoanFine,
  remainingAmount,
}: LedgerEntryInput): LoanPassbookEntry {
  return {
    transactionDate,

    type: LOAN_REPAYMENT_ENTRY,

    meetingId,

    description,

    amountPaid,

    interestDays,

    interestCharged,

    loanFineCharged,

    paidPrincipal,

    paidInterest,

    paidLoanFine,

    outstandingPrincipal,

    pendingInterest,

    pendingLoanFine,

    remainingAmount,
  };
}
