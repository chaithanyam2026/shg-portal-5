import { calculateEffectiveInterestRates } from "./effective-interest";
import type { LoanPassbook } from "./loan-passbook";

import type { LoanSummaryResult } from "../types";

/**
 * Computes the loan summary from
 * the generated loan passbook.
 */
export function calculateLoanSummary(
  passbook: LoanPassbook,
  referenceDate: Date = passbook.calculationEndDate,
): LoanSummaryResult {
  const entries = passbook.entries;

  const paidPrincipal = entries.reduce((total, entry) => total + entry.paidPrincipal, 0);

  const paidInterest = entries.reduce((total, entry) => total + entry.paidInterest, 0);

  const paidLoanFine = entries.reduce((total, entry) => total + entry.paidLoanFine, 0);

  const refundAmount = entries.reduce((total, entry) => total + entry.remainingAmount, 0);

  const latestEntry = entries.at(-1);

  const outstandingPrincipal = latestEntry?.outstandingPrincipal ?? passbook.disbursedAmount;

  const pendingInterest = latestEntry?.pendingInterest ?? 0;

  const pendingLoanFine = latestEntry?.pendingLoanFine ?? 0;

  const totalPayable = outstandingPrincipal + pendingInterest + pendingLoanFine;

  const effectiveInterest = calculateEffectiveInterestRates(passbook, referenceDate);

  const isClosable = outstandingPrincipal === 0 && pendingInterest === 0 && pendingLoanFine === 0;

  return {
    outstandingPrincipal,

    paidPrincipal,

    paidInterest,

    pendingInterest,

    paidLoanFine,

    pendingLoanFine,

    refundAmount,

    totalPayable,

    effectiveInterestPercentage: effectiveInterest.interestOnlyPercentage,

    effectiveInterestWithFinesPercentage: effectiveInterest.interestAndFinesPercentage,

    isClosable,
  };
}
