import type { PassbookEntryType } from "./passbook-entry-type";

/**
 * A single transaction in the
 * loan passbook.
 */
export type LoanPassbookEntry = {
  /**
   * Transaction date.
   */
  transactionDate: Date;

  /**
   * Entry type.
   */
  type: PassbookEntryType;

  /**
   * Meeting reference.
   *
   * Available only for repayments.
   */
  meetingId?: string;

  /**
   * Description shown in UI.
   */
  description: string;

  /**
   * Total payment received.
   */
  amountPaid: number;

  /**
   * Number of days for which
   * interest was charged.
   */
  interestDays: number;

  /**
   * Interest charged before
   * payment allocation.
   */
  interestCharged: number;

  /**
   * Monthly loan fine charged.
   */
  loanFineCharged: number;

  /**
   * Portion of payment allocated
   * towards loan fine.
   */
  paidLoanFine: number;

  /**
   * Portion of payment allocated
   * towards interest.
   */
  paidInterest: number;

  /**
   * Portion of payment allocated
   * towards principal.
   */
  paidPrincipal: number;

  /**
   * Outstanding principal after
   * this transaction.
   */
  outstandingPrincipal: number;

  /**
   * Pending interest after
   * this transaction.
   */
  pendingInterest: number;

  /**
   * Pending loan fine after
   * this transaction.
   */
  pendingLoanFine: number;

  /**
   * Excess payment that could not be allocated
   * (shown as refund amount).
   */
  remainingAmount: number;
};

/**
 * Complete loan passbook.
 */
export type LoanPassbook = {
  loanId: string;

  loanNumber: string;

  memberId: string;

  memberName: string;

  loanType: string;

  disbursedAmount: number;

  expectedMonthlyRepayment: number;

  disbursedDate: Date;

  closedDate?: Date | null;

  interestRate: number;

  /**
   * Interest and fines are calculated only up to this date
   * (typically the loan financial year end).
   */
  calculationEndDate: Date;

  entries: LoanPassbookEntry[];
};
