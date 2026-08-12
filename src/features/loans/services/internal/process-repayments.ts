import {
  allocateLoanPayment,
  calculateInterest,
  createLedgerEntry,
  evaluateMonthlyLoanFine,
  getMinimumMonthlyRepayment,
  getRepaymentCycle,
  getFineEligibility,
  MONTHLY_LOAN_FINE,
  updateOutstandingBalance,
} from "../../domain";

import type { LoanPassbook } from "../../domain";

import type { BuildLoanLedgerInput } from "./loan-ledger";

import type { LoanRepayment } from "./meeting-loader";

type ProcessRepaymentsInput = {
  loan: BuildLoanLedgerInput;

  repayments: LoanRepayment[];

  entries: LoanPassbook["entries"];

  outstandingPrincipal: number;

  pendingInterest: number;

  pendingLoanFine: number;
};

export type ProcessRepaymentsResult = {
  outstandingPrincipal: number;

  pendingInterest: number;

  pendingLoanFine: number;
};

function getEvaluationKey(repaymentDate: Date): string {
  const evaluationDate = new Date(repaymentDate.getFullYear(), repaymentDate.getMonth() - 1, 1);

  return `${evaluationDate.getFullYear()}-${evaluationDate.getMonth()}`;
}

function formatEvaluationMonth(repaymentDate: Date): string {
  const evaluationDate = new Date(repaymentDate.getFullYear(), repaymentDate.getMonth() - 1, 1);

  return evaluationDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function processRepayments({
  loan,
  repayments,
  entries,
  outstandingPrincipal,
  pendingInterest,
  pendingLoanFine,
}: ProcessRepaymentsInput): ProcessRepaymentsResult {
  let previousRepaymentDate: Date | undefined;

  const minimumMonthlyRepayment = getMinimumMonthlyRepayment(loan.disbursedAmount);

  const monthlyPrincipalPaid = new Map<string, number>();

  const monthlyFineEvaluated = new Set<string>();

  for (const repayment of repayments) {
    const repaymentCycle = getRepaymentCycle({
      disbursedDate: loan.disbursedDate,

      repaymentDate: repayment.meetingDate,

      previousRepaymentDate,
    });

    const evaluationKey = getEvaluationKey(repayment.meetingDate);

    const interest = calculateInterest({
      outstandingPrincipal,

      annualInterestRate: loan.interestRate,

      repaymentCycle,
    });

    pendingInterest += interest.interestAmount;

    const pendingFineBefore = pendingLoanFine;

    const allocation = allocateLoanPayment({
      payment: repayment.amountPaid,

      outstandingPrincipal,

      outstandingInterest: pendingInterest,

      outstandingFine: pendingLoanFine,
    });

    const { paidPrincipal, paidInterest, paidLoanFine } = allocation;

    const totalPrincipalForMonth =
      (monthlyPrincipalPaid.get(evaluationKey) ?? 0) + paidPrincipal;

    monthlyPrincipalPaid.set(evaluationKey, totalPrincipalForMonth);

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

    const eligibility = getFineEligibility({
      disbursedDate: loan.disbursedDate,

      repaymentCycle,
    });

    let loanFineCharged = 0;

    let description = "Loan repayment";

    if (
      eligibility.isEligible &&
      minimumMonthlyRepayment > 0 &&
      !monthlyFineEvaluated.has(evaluationKey)
    ) {
      const fineEvaluation = evaluateMonthlyLoanFine({
        minimumMonthlyRepayment,

        principalPaidThisMonth: totalPrincipalForMonth,

        pendingFineBefore,

        paidLoanFine,
      });

      monthlyFineEvaluated.add(evaluationKey);

      loanFineCharged = fineEvaluation.fineAmount;

      if (fineEvaluation.shouldApplyFine) {
        pendingLoanFine += MONTHLY_LOAN_FINE;

        loanFineCharged = MONTHLY_LOAN_FINE;

        description = `Loan repayment — monthly fine for ${formatEvaluationMonth(
          repayment.meetingDate,
        )} (₹${MONTHLY_LOAN_FINE})`;
      } else {
        description = `Loan repayment — monthly fine waived for ${formatEvaluationMonth(
          repayment.meetingDate,
        )}`;
      }
    }

    entries.push(
      createLedgerEntry({
        transactionDate: repayment.meetingDate,

        meetingId: repayment.meetingId,

        description,

        amountPaid: repayment.amountPaid,

        interestDays: interest.interestDays,

        interestCharged: interest.interestAmount,

        loanFineCharged,

        paidPrincipal,

        paidInterest,

        paidLoanFine,

        outstandingPrincipal,

        pendingInterest,

        pendingLoanFine,

        remainingAmount: allocation.remainingAmount,
      }),
    );

    previousRepaymentDate = repayment.meetingDate;
  }

  return {
    outstandingPrincipal,

    pendingInterest,

    pendingLoanFine,
  };
}
