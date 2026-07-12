import {
  allocateLoanPayment,
  calculateInterest,
  calculateMonthlyFine,
  createLedgerEntry,
  getRepaymentCycle,
  updateOutstandingBalance,
} from "../../domain";

import type {
  LoanPassbook,
} from "../../domain";

import type {
  BuildLoanLedgerInput,
} from "./loan-ledger";

import type {
  LoanRepayment,
} from "./meeting-loader";

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

export function processRepayments({
  loan,
  repayments,
  entries,
  outstandingPrincipal,
  pendingInterest,
  pendingLoanFine,
}: ProcessRepaymentsInput): ProcessRepaymentsResult {
  let previousRepaymentDate:
    Date | undefined;

  for (const repayment of repayments) {
    const repaymentCycle =
      getRepaymentCycle({
        disbursedDate:
          loan.disbursedDate,

        repaymentDate:
          repayment.meetingDate,

        previousRepaymentDate,
      });

    const interest =
      calculateInterest({
        outstandingPrincipal,

        annualInterestRate:
          loan.interestRate,

        repaymentCycle,
      });

    pendingInterest +=
      interest.interestAmount;

    const monthlyFine =
      calculateMonthlyFine({
        disbursedDate:
          loan.disbursedDate,

        repaymentCycle,

        expectedMonthlyRepayment:
          loan.expectedMonthlyRepayment,

        principalPaidThisMonth: 0,
      });

    if (
      monthlyFine.isApplicable
    ) {
      pendingLoanFine +=
        monthlyFine.fineAmount;
    }

    const allocation =
      allocateLoanPayment({
        payment:
          repayment.amountPaid,

        outstandingPrincipal,

        outstandingInterest:
          pendingInterest,

        outstandingFine:
          pendingLoanFine,
      });

    const {
      paidPrincipal,
      paidInterest,
      paidLoanFine,
    } = allocation;

    const balances =
      updateOutstandingBalance({
        outstandingPrincipal,

        pendingInterest,

        pendingLoanFine,

        paidPrincipal,

        paidInterest,

        paidLoanFine,
      });

    outstandingPrincipal =
      balances.outstandingPrincipal;

    pendingInterest =
      balances.pendingInterest;

    pendingLoanFine =
      balances.pendingLoanFine;

    const recalculatedFine =
      calculateMonthlyFine({
        disbursedDate:
          loan.disbursedDate,

        repaymentCycle,

        expectedMonthlyRepayment:
          loan.expectedMonthlyRepayment,

        principalPaidThisMonth:
          paidPrincipal,
      });

    entries.push(
      createLedgerEntry({
        transactionDate:
          repayment.meetingDate,

        meetingId:
          repayment.meetingId,

        amountPaid:
          repayment.amountPaid,

        interestDays:
          interest.interestDays,

        interestCharged:
          interest.interestAmount,

        loanFineCharged:
          recalculatedFine.fineAmount,

        paidPrincipal,

        paidInterest,

        paidLoanFine,

        outstandingPrincipal,

        pendingInterest,

        pendingLoanFine,

        remainingAmount:
          allocation.remainingAmount,
      }),
    );

    previousRepaymentDate =
      repayment.meetingDate;
  }

  return {
    outstandingPrincipal,

    pendingInterest,

    pendingLoanFine,
  };
}