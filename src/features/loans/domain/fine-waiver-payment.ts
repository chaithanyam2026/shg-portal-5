import { formatCalendarMonthLabel, getCalendarMonthKey } from "./evaluation-month";
import { compareCalendarDates } from "@/lib/utils/date";
import { evaluateMonthlyLoanFineAtMonthEnd } from "./loan-fine";
import { getFineEligibilityForMonth } from "./fine-eligibility";
import type { LoanPassbook } from "./loan-passbook";
import { isRepaymentEntry } from "./passbook-entry-type";

export type FineWaiverPaymentInput = {
  minimumMonthlyRepayment: number;
  principalPaidInMonth: number;
  pendingFineDueDuringMonth: number;
  finePaidDuringMonth: number;
  currentPendingLoanFine: number;
  outstandingPrincipal: number;
  evaluationMonthLabel: string;
  lastMonthFineCharged: number;
};

export type FineWaiverPaymentResult = {
  amount: number;
  pendingFineShortfall: number;
  minimumPrincipalShortfall: number;
  lastMonthFineCharged: number;
  isWaived: boolean;
  reason: string;
};

export type FineWaiverSnapshot = {
  evaluationMonthLabel: string;
  checkpointMonthLabel: string;
  principalPaidThisMonth: number;
  lastMonthFineCharged: number;
  pendingFineShortfall: number;
  minimumPrincipalShortfall: number;
  amountToPay: number;
  isWaived: boolean;
  isEligible: boolean;
  reason: string;
};

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getPendingFineAtMonthStart(passbook: LoanPassbook, monthStart: Date): number {
  let pendingFineAtMonthStart = 0;

  for (const entry of passbook.entries) {
    if (entry.transactionDate.getTime() >= monthStart.getTime()) {
      break;
    }

    pendingFineAtMonthStart = entry.pendingLoanFine;
  }

  return pendingFineAtMonthStart;
}

function getFirstEntryInMonth(
  passbook: LoanPassbook,
  monthStart: Date,
  monthKey: string,
): LoanPassbook["entries"][number] | undefined {
  for (const entry of passbook.entries) {
    if (entry.transactionDate.getTime() < monthStart.getTime()) {
      continue;
    }

    if (getCalendarMonthKey(entry.transactionDate) !== monthKey) {
      break;
    }

    return entry;
  }

  return undefined;
}

function getPendingFineDueDuringMonth(
  passbook: LoanPassbook,
  monthStart: Date,
  monthKey: string,
): number {
  const firstEntryInMonth = getFirstEntryInMonth(passbook, monthStart, monthKey);

  if (firstEntryInMonth) {
    return firstEntryInMonth.pendingLoanFine;
  }

  return getPendingFineAtMonthStart(passbook, monthStart);
}

function getLastMonthFineCharged(
  passbook: LoanPassbook,
  monthStart: Date,
  monthKey: string,
): number {
  const firstEntryInMonth = getFirstEntryInMonth(passbook, monthStart, monthKey);

  return firstEntryInMonth?.loanFineCharged ?? 0;
}

function getMonthlyRepaymentActivity(
  passbook: LoanPassbook,
  monthKey: string,
): {
  principalPaid: number;
  finePaid: number;
} {
  return passbook.entries.reduce(
    (totals, entry) => {
      if (!isRepaymentEntry(entry.type)) {
        return totals;
      }

      if (getCalendarMonthKey(entry.transactionDate) !== monthKey) {
        return totals;
      }

      totals.principalPaid += entry.paidPrincipal;
      totals.finePaid += entry.paidLoanFine;

      return totals;
    },
    {
      principalPaid: 0,
      finePaid: 0,
    },
  );
}

/**
 * Calculates the additional loan repayment needed before month-end so the
 * monthly fine checkpoint on the 1st waives the fine.
 *
 * Includes current pending loan fines (including last month's fine posted on
 * the 1st) and the minimum monthly principal shortfall — not pending interest.
 */
export function calculateFineWaiverPayment(
  input: FineWaiverPaymentInput,
): FineWaiverPaymentResult {
  const {
    minimumMonthlyRepayment,
    principalPaidInMonth,
    pendingFineDueDuringMonth,
    finePaidDuringMonth,
    currentPendingLoanFine,
    outstandingPrincipal,
    evaluationMonthLabel,
    lastMonthFineCharged,
  } = input;

  const pendingFineShortfall = Math.max(0, currentPendingLoanFine);
  const minimumPrincipalShortfall = Math.min(
    Math.max(0, minimumMonthlyRepayment - principalPaidInMonth),
    outstandingPrincipal,
  );

  const evaluation = evaluateMonthlyLoanFineAtMonthEnd({
    minimumMonthlyRepayment,
    principalPaidInMonth,
    pendingFineAtMonthStart: pendingFineDueDuringMonth,
    finePaidDuringMonth,
  });

  if (evaluation.shouldApplyFine === false) {
    return {
      amount: 0,
      pendingFineShortfall: 0,
      minimumPrincipalShortfall: 0,
      lastMonthFineCharged,
      isWaived: true,
      reason: `${evaluationMonthLabel}: minimum monthly repayment and pending loan fines are already met.`,
    };
  }

  const amount = pendingFineShortfall + minimumPrincipalShortfall;

  if (amount <= 0) {
    return {
      amount: 0,
      pendingFineShortfall,
      minimumPrincipalShortfall,
      lastMonthFineCharged,
      isWaived: true,
      reason: `${evaluationMonthLabel}: no additional repayment is required to waive the monthly loan fine.`,
    };
  }

  const projectedEvaluation = evaluateMonthlyLoanFineAtMonthEnd({
    minimumMonthlyRepayment,
    principalPaidInMonth: principalPaidInMonth + minimumPrincipalShortfall,
    pendingFineAtMonthStart: pendingFineDueDuringMonth,
    finePaidDuringMonth: finePaidDuringMonth + pendingFineShortfall,
  });

  const parts: string[] = [];

  if (pendingFineShortfall > 0) {
    if (lastMonthFineCharged > 0) {
      parts.push(
        `pending loan fines of ${formatCurrencyPart(pendingFineShortfall)} (includes last month's fine of ${formatCurrencyPart(lastMonthFineCharged)})`,
      );
    } else {
      parts.push(`pending loan fines of ${formatCurrencyPart(pendingFineShortfall)}`);
    }
  }

  if (minimumPrincipalShortfall > 0) {
    parts.push(`minimum monthly principal of ${formatCurrencyPart(minimumPrincipalShortfall)}`);
  }

  const breakdown = parts.join(" and ");

  if (!projectedEvaluation.shouldApplyFine) {
    return {
      amount,
      pendingFineShortfall,
      minimumPrincipalShortfall,
      lastMonthFineCharged,
      isWaived: false,
      reason: `${evaluationMonthLabel}: pay ${formatCurrencyPart(amount)} before month-end (${breakdown}) to waive the fine on the 1st of next month.`,
    };
  }

  return {
    amount,
    pendingFineShortfall,
    minimumPrincipalShortfall,
    lastMonthFineCharged,
    isWaived: false,
    reason: `${evaluationMonthLabel}: ${projectedEvaluation.reason}`,
  };
}

function formatCurrencyPart(value: number): string {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function buildFineWaiverSnapshot(
  passbook: LoanPassbook,
  referenceDate: Date = new Date(),
): FineWaiverSnapshot {
  const effectiveReferenceDate =
    compareCalendarDates(referenceDate, passbook.calculationEndDate) > 0
      ? passbook.calculationEndDate
      : referenceDate;

  const minimumMonthlyRepayment = passbook.expectedMonthlyRepayment;
  const monthStart = getMonthStart(effectiveReferenceDate);
  const monthKey = getCalendarMonthKey(effectiveReferenceDate);
  const evaluationMonthLabel = formatCalendarMonthLabel(
    effectiveReferenceDate.getFullYear(),
    effectiveReferenceDate.getMonth(),
  );
  const checkpointDate = new Date(
    effectiveReferenceDate.getFullYear(),
    effectiveReferenceDate.getMonth() + 1,
    1,
  );
  const checkpointMonthLabel = formatCalendarMonthLabel(
    checkpointDate.getFullYear(),
    checkpointDate.getMonth(),
  );

  const activity = getMonthlyRepaymentActivity(passbook, monthKey);
  const pendingFineDueDuringMonth = getPendingFineDueDuringMonth(passbook, monthStart, monthKey);
  const lastMonthFineCharged = getLastMonthFineCharged(passbook, monthStart, monthKey);

  const latestEntry = passbook.entries.at(-1);
  const currentPendingLoanFine = latestEntry?.pendingLoanFine ?? 0;
  const outstandingPrincipal = latestEntry?.outstandingPrincipal ?? passbook.disbursedAmount;

  const eligibility = getFineEligibilityForMonth(
    passbook.disbursedDate,
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
  );

  if (!eligibility.isEligible) {
    return {
      evaluationMonthLabel,
      checkpointMonthLabel,
      principalPaidThisMonth: activity.principalPaid,
      lastMonthFineCharged,
      pendingFineShortfall: 0,
      minimumPrincipalShortfall: 0,
      amountToPay: 0,
      isWaived: true,
      isEligible: false,
      reason: `${evaluationMonthLabel}: ${eligibility.reason}`,
    };
  }

  const waiver = calculateFineWaiverPayment({
    minimumMonthlyRepayment,
    principalPaidInMonth: activity.principalPaid,
    pendingFineDueDuringMonth,
    finePaidDuringMonth: activity.finePaid,
    currentPendingLoanFine,
    outstandingPrincipal,
    evaluationMonthLabel,
    lastMonthFineCharged,
  });

  return {
    evaluationMonthLabel,
    checkpointMonthLabel,
    principalPaidThisMonth: activity.principalPaid,
    lastMonthFineCharged: waiver.lastMonthFineCharged,
    pendingFineShortfall: waiver.pendingFineShortfall,
    minimumPrincipalShortfall: waiver.minimumPrincipalShortfall,
    amountToPay: waiver.amount,
    isWaived: waiver.isWaived,
    isEligible: true,
    reason: waiver.reason,
  };
}
