import connectMongo from "@/lib/db/mongodb";

import { getLoanPassbook } from "./get-passbook";

import type { LoanSummaryResult } from "../types";

import { calculateLoanSummary } from "../domain";
import { LoanIdInput, LoanIdSchema } from "../validation";

/**
 * Returns computed loan summary.
 *
 * Summary is derived completely from
 * the loan passbook, which acts as the
 * single source of truth.
 */
export async function getLoanSummary(loanId: LoanIdInput): Promise<LoanSummaryResult> {
  await connectMongo();

  const id = LoanIdSchema.parse(loanId);

  const passbook = await getLoanPassbook(id);

  return calculateLoanSummary(passbook);
  // const entries =
  //   passbook.entries;

  // const paidPrincipal =
  //   entries.reduce(
  //     (
  //       total,
  //       entry,
  //     ) =>
  //       total +
  //       entry.paidPrincipal,
  //     0,
  //   );

  // const paidInterest =
  //   entries.reduce(
  //     (
  //       total,
  //       entry,
  //     ) =>
  //       total +
  //       entry.paidInterest,
  //     0,
  //   );

  // const paidLoanFine =
  //   entries.reduce(
  //     (
  //       total,
  //       entry,
  //     ) =>
  //       total +
  //       entry.paidLoanFine,
  //     0,
  //   );

  // const latest =
  //   entries[
  //     entries.length - 1
  //   ];

  // const outstandingPrincipal =
  //   latest?.outstandingPrincipal ??
  //   passbook.disbursedAmount;

  // const pendingInterest =
  //   latest?.pendingInterest ??
  //   0;

  // const pendingLoanFine =
  //   latest?.pendingLoanFine ??
  //   0;

  // const totalPayable =
  //   outstandingPrincipal +
  //   pendingInterest +
  //   pendingLoanFine;

  // const effectiveInterestPercentage =
  //   passbook.disbursedAmount === 0
  //     ? 0
  //     : Number(
  //         (
  //           (paidInterest /
  //             passbook.disbursedAmount) *
  //           100
  //         ).toFixed(2),
  //       );

  // const isClosable =
  //   outstandingPrincipal ===
  //     0 &&
  //   pendingInterest ===
  //     0 &&
  //   pendingLoanFine ===
  //     0;

  // return {
  //   outstandingPrincipal,

  //   paidPrincipal,

  //   paidInterest,

  //   pendingInterest,

  //   paidLoanFine,

  //   pendingLoanFine,

  //   totalPayable,

  //   effectiveInterestPercentage,

  //   isClosable,
  // };
}
