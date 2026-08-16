import { compareCalendarDates, toCalendarDate } from "@/lib/utils/date";

import {
  allocateLoanPayment,
  calculateInterest,
  createFineLedgerEntry,
  createLedgerEntry,
  evaluateMonthlyLoanFineAtMonthEnd,
  getFineEligibilityForMonth,
  getMinimumMonthlyRepayment,
  getRepaymentCycle,
  isWithinLoanRepaymentWindow,
  MONTHLY_LOAN_FINE,
  updateOutstandingBalance,
} from "../../domain";

import type { LoanPassbook } from "../../domain";

import {
  formatCalendarMonthLabel,
  getCalendarMonthKey,
  getEvaluatedMonthForCheckpoint,
  getMonthlyFineCheckpoints,
} from "../../domain/evaluation-month";

import type { BuildLoanLedgerInput } from "./loan-ledger";

import type { LoanRepayment } from "./meeting-loader";

type TimelineEvent =
  | {
    type: "checkpoint";
    date: Date;
  }
  | {
    type: "repayment";
    repayment: LoanRepayment;
  };

type ProcessLoanTimelineInput = {
  loan: BuildLoanLedgerInput;

  repayments: LoanRepayment[];

  entries: LoanPassbook["entries"];

  outstandingPrincipal: number;

  pendingInterest: number;

  pendingLoanFine: number;

  financialYearEndDate: Date;
};

export type ProcessLoanTimelineResult = {
  outstandingPrincipal: number;

  pendingInterest: number;

  pendingLoanFine: number;
};

type MonthlyActivity = {
  principalPaid: number;

  finePaid: number;
};

type MonthlyFineEvaluationResult = {
  loanFineCharged: number;

  description: string;

  shouldApplyFine: boolean;
};

function shouldEvaluateFineAtFinancialYearEnd(financialYearEndDate: Date): boolean {
  const nextMonthCheckpoint = new Date(
    financialYearEndDate.getFullYear(),
    financialYearEndDate.getMonth() + 1,
    1,
  );

  return compareCalendarDates(nextMonthCheckpoint, financialYearEndDate) > 0;
}

function evaluateMonthlyFineForMonth(
  loan: BuildLoanLedgerInput,
  year: number,
  month: number,
  minimumMonthlyRepayment: number,
  monthlyActivity: Map<string, MonthlyActivity>,
  monthStartPendingFine: Map<string, number>,
  monthFineDueDuringMonth: Map<string, number>,
): MonthlyFineEvaluationResult {
  const evaluatedMonthKey = `${year}-${month}`;
  const eligibility = getFineEligibilityForMonth(loan.disbursedDate, year, month);

  if (!eligibility.isEligible) {
    return {
      loanFineCharged: 0,
      description: `${formatCalendarMonthLabel(year, month)} — ${eligibility.reason}`,
      shouldApplyFine: false,
    };
  }

  if (minimumMonthlyRepayment === 0) {
    return {
      loanFineCharged: 0,
      description: `Monthly fine waived for ${formatCalendarMonthLabel(year, month)}`,
      shouldApplyFine: false,
    };
  }

  const activity = monthlyActivity.get(evaluatedMonthKey) ?? {
    principalPaid: 0,
    finePaid: 0,
  };

  const fineEvaluation = evaluateMonthlyLoanFineAtMonthEnd({
    minimumMonthlyRepayment,
    principalPaidInMonth: activity.principalPaid,
    pendingFineAtMonthStart:
      monthFineDueDuringMonth.get(evaluatedMonthKey) ??
      monthStartPendingFine.get(evaluatedMonthKey) ??
      0,
    finePaidDuringMonth: activity.finePaid,
  });

  if (fineEvaluation.shouldApplyFine) {
    return {
      loanFineCharged: MONTHLY_LOAN_FINE,
      description: `Monthly fine for ${formatCalendarMonthLabel(year, month)} (₹${MONTHLY_LOAN_FINE})`,
      shouldApplyFine: true,
    };
  }

  return {
    loanFineCharged: 0,
    description: `Monthly fine waived for ${formatCalendarMonthLabel(year, month)}`,
    shouldApplyFine: false,
  };
}

function filterRepaymentsForLoanWindow(
  repayments: LoanRepayment[],
  disbursedDate: Date,
  closedDate: Date | null | undefined,
  financialYearEndDate: Date,
): LoanRepayment[] {
  return repayments.filter((repayment) => {
    if (!isWithinLoanRepaymentWindow(repayment.meetingDate, disbursedDate, closedDate)) {
      return false;
    }

    return !isAfterFinancialYearEnd(repayment.meetingDate, financialYearEndDate);
  });
}

function buildFinancialYearEndFineDescription(
  fineEvaluation: MonthlyFineEvaluationResult,
): string {
  return `${fineEvaluation.description} (financial year end)`;
}

function capAtFinancialYearEnd(date: Date, financialYearEndDate: Date): Date {
  return compareCalendarDates(date, financialYearEndDate) > 0
    ? toCalendarDate(financialYearEndDate)
    : toCalendarDate(date);
}

function isAfterFinancialYearEnd(date: Date, financialYearEndDate: Date): boolean {
  return compareCalendarDates(date, financialYearEndDate) > 0;
}

function getTimelineEndDate(
  repayments: LoanRepayment[],
  financialYearEndDate: Date,
): Date {
  const lastRepaymentDate = repayments.at(-1)?.meetingDate;
  const today = new Date();
  const calculationEnd = lastRepaymentDate
    ? new Date(Math.max(lastRepaymentDate.getTime(), today.getTime()))
    : today;

  return capAtFinancialYearEnd(calculationEnd, financialYearEndDate);
}

function calculateInterestUpToDate(
  loan: BuildLoanLedgerInput,
  outstandingPrincipal: number,
  previousTransactionDate: Date,
  eventDate: Date,
  financialYearEndDate: Date,
) {
  if (isAfterFinancialYearEnd(previousTransactionDate, financialYearEndDate)) {
    return {
      interestAmount: 0,
      interestDays: 0,
    };
  }

  const interestEndDate = capAtFinancialYearEnd(eventDate, financialYearEndDate);

  return calculateInterest({
    outstandingPrincipal,
    annualInterestRate: loan.interestRate,
    repaymentCycle: getRepaymentCycle({
      disbursedDate: loan.disbursedDate,
      repaymentDate: interestEndDate,
      previousRepaymentDate: previousTransactionDate,
    }),
  });
}

function buildTimeline(
  repayments: LoanRepayment[],
  disbursedDate: Date,
  financialYearEndDate: Date,
): TimelineEvent[] {
  const endDate = getTimelineEndDate(repayments, financialYearEndDate);
  const checkpoints = getMonthlyFineCheckpoints(disbursedDate, endDate);

  const events: TimelineEvent[] = [
    ...checkpoints.map((date) => ({
      type: "checkpoint" as const,
      date,
    })),
    ...repayments.map((repayment) => ({
      type: "repayment" as const,
      repayment,
    })),
  ];

  return events.sort((left, right) => {
    const leftDate = left.type === "checkpoint" ? left.date : left.repayment.meetingDate;
    const rightDate = right.type === "checkpoint" ? right.date : right.repayment.meetingDate;
    const difference = leftDate.getTime() - rightDate.getTime();

    if (difference !== 0) {
      return difference;
    }

    if (left.type === "checkpoint") {
      return -1;
    }

    if (right.type === "checkpoint") {
      return 1;
    }

    return 0;
  });
}

function ensureMonthTracked(
  monthKey: string,
  pendingLoanFine: number,
  monthStartPendingFine: Map<string, number>,
): void {
  if (!monthStartPendingFine.has(monthKey)) {
    monthStartPendingFine.set(monthKey, pendingLoanFine);
  }
}

export function processLoanTimeline({
  loan,
  repayments,
  entries,
  outstandingPrincipal,
  pendingInterest,
  pendingLoanFine,
  financialYearEndDate,
}: ProcessLoanTimelineInput): ProcessLoanTimelineResult {
  const financialYearRepayments = filterRepaymentsForLoanWindow(
    repayments,
    loan.disbursedDate,
    loan.closedDate,
    financialYearEndDate,
  );

  let previousTransactionDate = loan.disbursedDate;
  let currentMonthKey = getCalendarMonthKey(loan.disbursedDate);

  const minimumMonthlyRepayment =
    loan.expectedMonthlyRepayment ?? getMinimumMonthlyRepayment(loan.disbursedAmount);
  const monthStartPendingFine = new Map<string, number>();
  const monthFineDueDuringMonth = new Map<string, number>();
  const monthlyActivity = new Map<string, MonthlyActivity>();

  monthStartPendingFine.set(currentMonthKey, 0);

  for (const event of buildTimeline(
    financialYearRepayments,
    loan.disbursedDate,
    financialYearEndDate,
  )) {
    if (outstandingPrincipal <= 0) {
      break;
    }

    const eventDate = event.type === "checkpoint" ? event.date : event.repayment.meetingDate;
    const eventMonthKey = getCalendarMonthKey(eventDate);

    if (eventMonthKey !== currentMonthKey) {
      ensureMonthTracked(eventMonthKey, pendingLoanFine, monthStartPendingFine);
      currentMonthKey = eventMonthKey;
    }

    if (event.type === "checkpoint") {
      const interest = calculateInterestUpToDate(
        loan,
        outstandingPrincipal,
        previousTransactionDate,
        event.date,
        financialYearEndDate,
      );

      pendingInterest += interest.interestAmount;

      const evaluatedMonth = getEvaluatedMonthForCheckpoint(event.date);

      const fineResult = evaluateMonthlyFineForMonth(
        loan,
        evaluatedMonth.year,
        evaluatedMonth.month,
        minimumMonthlyRepayment,
        monthlyActivity,
        monthStartPendingFine,
        monthFineDueDuringMonth,
      );

      const loanFineCharged = fineResult.loanFineCharged;
      const description = fineResult.description;

      if (fineResult.shouldApplyFine) {
        pendingLoanFine += MONTHLY_LOAN_FINE;
      }

      monthFineDueDuringMonth.set(eventMonthKey, pendingLoanFine);

      entries.push(
        createFineLedgerEntry({
          transactionDate: event.date,
          description,
          interestDays: interest.interestDays,
          interestCharged: interest.interestAmount,
          loanFineCharged,
          outstandingPrincipal,
          pendingInterest,
          pendingLoanFine,
        }),
      );

      previousTransactionDate = event.date;
      continue;
    }

    const repayment = event.repayment;
    const interest = calculateInterestUpToDate(
      loan,
      outstandingPrincipal,
      previousTransactionDate,
      repayment.meetingDate,
      financialYearEndDate,
    );

    pendingInterest += interest.interestAmount;

    const allocation = allocateLoanPayment({
      payment: repayment.amountPaid,
      outstandingPrincipal,
      outstandingInterest: pendingInterest,
      outstandingFine: pendingLoanFine,
    });

    const { paidPrincipal, paidInterest, paidLoanFine } = allocation;

    const balances = updateOutstandingBalance({
      outstandingPrincipal,
      pendingInterest,
      pendingLoanFine,
      paidPrincipal,
      paidInterest,
      paidLoanFine,
    });

    outstandingPrincipal = balances.outstandingPrincipal;
    pendingInterest = balances.pendingInterest;
    pendingLoanFine = balances.pendingLoanFine;

    const repaymentMonthKey = getCalendarMonthKey(repayment.meetingDate);
    const activity = monthlyActivity.get(repaymentMonthKey) ?? {
      principalPaid: 0,
      finePaid: 0,
    };

    activity.principalPaid += paidPrincipal;
    activity.finePaid += paidLoanFine;
    monthlyActivity.set(repaymentMonthKey, activity);

    entries.push(
      createLedgerEntry({
        transactionDate: repayment.meetingDate,
        meetingId: repayment.meetingId,
        description: "Loan repayment",
        amountPaid: repayment.amountPaid,
        interestDays: interest.interestDays,
        interestCharged: interest.interestAmount,
        loanFineCharged: 0,
        paidPrincipal,
        paidInterest,
        paidLoanFine,
        outstandingPrincipal,
        pendingInterest,
        pendingLoanFine,
        remainingAmount: allocation.remainingAmount,
      }),
    );

    previousTransactionDate = repayment.meetingDate;
  }

  if (
    outstandingPrincipal > 0 &&
    !isAfterFinancialYearEnd(previousTransactionDate, financialYearEndDate)
  ) {
    const interest = calculateInterestUpToDate(
      loan,
      outstandingPrincipal,
      previousTransactionDate,
      financialYearEndDate,
      financialYearEndDate,
    );

    if (interest.interestAmount > 0) {
      pendingInterest += interest.interestAmount;

      entries.push(
        createFineLedgerEntry({
          transactionDate: toCalendarDate(financialYearEndDate),
          description: "Interest accrued till financial year end",
          interestDays: interest.interestDays,
          interestCharged: interest.interestAmount,
          loanFineCharged: 0,
          outstandingPrincipal,
          pendingInterest,
          pendingLoanFine,
        }),
      );
    }

    if (shouldEvaluateFineAtFinancialYearEnd(financialYearEndDate)) {
      const fyEndYear = financialYearEndDate.getFullYear();
      const fyEndMonth = financialYearEndDate.getMonth();

      const fineResult = evaluateMonthlyFineForMonth(
        loan,
        fyEndYear,
        fyEndMonth,
        minimumMonthlyRepayment,
        monthlyActivity,
        monthStartPendingFine,
        monthFineDueDuringMonth,
      );

      if (fineResult.shouldApplyFine) {
        pendingLoanFine += MONTHLY_LOAN_FINE;
      }

      entries.push(
        createFineLedgerEntry({
          transactionDate: toCalendarDate(financialYearEndDate),
          description: buildFinancialYearEndFineDescription(fineResult),
          interestDays: 0,
          interestCharged: 0,
          loanFineCharged: fineResult.loanFineCharged,
          outstandingPrincipal,
          pendingInterest,
          pendingLoanFine,
        }),
      );
    }
  }

  return {
    outstandingPrincipal,
    pendingInterest,
    pendingLoanFine,
  };
}
