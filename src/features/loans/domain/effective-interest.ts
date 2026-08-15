import { compareCalendarDates } from "@/lib/utils/date";

import { calculateInterest } from "./interest-engine";
import type { LoanPassbook } from "./loan-passbook";
import { getRepaymentCycle } from "./repayment-cycle";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export type EffectiveInterestRates = {
  interestOnlyPercentage: number;
  interestAndFinesPercentage: number;
  totalInterestToDate: number;
  totalInterestAndFinesToDate: number;
  accruedInterestToToday: number;
  daysSinceDisbursement: number;
};

function getDaysSinceDisbursement(disbursedDate: Date, referenceDate: Date): number {
  return Math.max(
    Math.floor((referenceDate.getTime() - disbursedDate.getTime()) / MILLISECONDS_PER_DAY) + 1,
    1,
  );
}

function annualizeNonDiminishingRate(
  totalCost: number,
  disbursedAmount: number,
  daysSinceDisbursement: number,
): number {
  if (disbursedAmount <= 0 || daysSinceDisbursement <= 0) {
    return 0;
  }

  const cumulativePercentage = (totalCost / disbursedAmount) * 100;

  return Number(((cumulativePercentage * 365) / daysSinceDisbursement).toFixed(2));
}

/**
 * Effective interest on the disbursed amount in a non-diminishing way,
 * annualized using days from disbursement to the calculation end date.
 */
export function calculateEffectiveInterestRates(
  passbook: LoanPassbook,
  referenceDate: Date = new Date(),
): EffectiveInterestRates {
  const calculationEndDate =
    compareCalendarDates(referenceDate, passbook.calculationEndDate) > 0
      ? passbook.calculationEndDate
      : referenceDate;

  const entries = passbook.entries;

  const paidInterest = entries.reduce((total, entry) => total + entry.paidInterest, 0);
  const paidLoanFine = entries.reduce((total, entry) => total + entry.paidLoanFine, 0);

  const latestEntry = entries.at(-1);
  const pendingInterest = latestEntry?.pendingInterest ?? 0;
  const pendingLoanFine = latestEntry?.pendingLoanFine ?? 0;
  const outstandingPrincipal = latestEntry?.outstandingPrincipal ?? passbook.disbursedAmount;
  const lastTransactionDate = latestEntry?.transactionDate ?? passbook.disbursedDate;

  let accruedInterestToToday = 0;

  if (
    outstandingPrincipal > 0 &&
    passbook.interestRate > 0 &&
    compareCalendarDates(lastTransactionDate, calculationEndDate) < 0
  ) {
    const accrued = calculateInterest({
      outstandingPrincipal,
      annualInterestRate: passbook.interestRate,
      repaymentCycle: getRepaymentCycle({
        disbursedDate: passbook.disbursedDate,
        repaymentDate: calculationEndDate,
        previousRepaymentDate: lastTransactionDate,
      }),
    });

    accruedInterestToToday = accrued.interestAmount;
  }

  const totalInterestToDate = paidInterest + pendingInterest + accruedInterestToToday;
  const totalInterestAndFinesToDate = totalInterestToDate + paidLoanFine + pendingLoanFine;
  const daysSinceDisbursement = getDaysSinceDisbursement(
    passbook.disbursedDate,
    calculationEndDate,
  );

  return {
    interestOnlyPercentage: annualizeNonDiminishingRate(
      totalInterestToDate,
      passbook.disbursedAmount,
      daysSinceDisbursement,
    ),
    interestAndFinesPercentage: annualizeNonDiminishingRate(
      totalInterestAndFinesToDate,
      passbook.disbursedAmount,
      daysSinceDisbursement,
    ),
    totalInterestToDate: Number(totalInterestToDate.toFixed(2)),
    totalInterestAndFinesToDate: Number(totalInterestAndFinesToDate.toFixed(2)),
    accruedInterestToToday,
    daysSinceDisbursement,
  };
}
