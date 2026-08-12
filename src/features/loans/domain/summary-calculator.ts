import type { LoanPassbook } from "./loan-passbook";

import type { LoanSummaryResult } from "../types";

/**
 * Computes the loan summary from
 * the generated loan passbook.
 */
export function calculateLoanSummary(passbook: LoanPassbook): LoanSummaryResult {
  const entries = passbook.entries;

  const paidPrincipal = entries.reduce((total, entry) => total + entry.paidPrincipal, 0);

  const paidInterest = entries.reduce((total, entry) => total + entry.paidInterest, 0);

  const paidLoanFine = entries.reduce((total, entry) => total + entry.paidLoanFine, 0);

  const latestEntry = entries.at(-1);

  const outstandingPrincipal = latestEntry?.outstandingPrincipal ?? passbook.disbursedAmount;

  const pendingInterest = latestEntry?.pendingInterest ?? 0;

  const pendingLoanFine = latestEntry?.pendingLoanFine ?? 0;

  const totalPayable = outstandingPrincipal + pendingInterest + pendingLoanFine;

  const effectiveInterestPercentage =
    passbook.disbursedAmount === 0
      ? 0
      : Number(((paidInterest / passbook.disbursedAmount) * 100).toFixed(2));

  const isClosable = outstandingPrincipal === 0 && pendingInterest === 0 && pendingLoanFine === 0;

  return {
    outstandingPrincipal,

    paidPrincipal,

    paidInterest,

    pendingInterest,

    paidLoanFine,

    pendingLoanFine,

    totalPayable,

    effectiveInterestPercentage,

    isClosable,
  };
}
