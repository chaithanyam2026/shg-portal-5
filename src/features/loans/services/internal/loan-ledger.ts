// import Meeting from "@/models/Meeting";
import { loadLoanRepayments } from "./meeting-loader";

import { LOAN_DISBURSED_ENTRY } from "../../domain/passbook-entry-type";

import { processRepayments } from "./process-repayments";

import type { LoanPassbook } from "../../domain/loan-passbook";

import { validateLoanPassbook } from "../../domain";

export type BuildLoanLedgerInput = {
  _id: unknown;

  loanNumber: string;

  memberId: unknown;

  memberName: string;

  loanType: string;

  disbursedAmount: number;

  interestRate: number;

  expectedMonthlyRepayment: number;

  disbursedDate: Date;
};

type LoanRepayment = {
  meetingId: string;

  meetingDate: Date;

  amountPaid: number;
};

/**
 * Builds the complete loan ledger.
 */
export async function buildLoanLedger(loan: BuildLoanLedgerInput): Promise<LoanPassbook> {
  /**
   * Load meetings for the member.
   */
  const repayments = await loadLoanRepayments({
    memberId: loan.memberId,
  });

  /**
   * Running balances.
   */
  let outstandingPrincipal = loan.disbursedAmount;

  let pendingInterest = 0;

  let pendingLoanFine = 0;

  /**
   * Loan passbook entries.
   */
  const entries: LoanPassbook["entries"] = [
    {
      transactionDate: loan.disbursedDate,

      type: LOAN_DISBURSED_ENTRY,

      description: "Loan disbursed",

      amountPaid: 0,

      interestCharged: 0,

      interestDays: 0,

      loanFineCharged: 0,

      paidInterest: 0,

      paidLoanFine: 0,

      paidPrincipal: 0,

      outstandingPrincipal,

      pendingInterest,

      pendingLoanFine,
    },
  ];

  /**
   * Previous repayment date.
   */
  /**
   * Previous repayment date.
   */
  // let previousRepaymentDate:
  //   Date | undefined;

  // for (const repayment of repayments) {
  //   /**
  //    * Determine repayment cycle.
  //    */
  //   const repaymentCycle =
  //     getRepaymentCycle({
  //       disbursedDate:
  //         loan.disbursedDate,

  //       repaymentDate:
  //         repayment.meetingDate,

  //       previousRepaymentDate,
  //     });

  //   /**
  //    * Interest accrued.
  //    */
  //   const interest =
  //     calculateInterest({
  //       outstandingPrincipal,

  //       annualInterestRate:
  //         loan.interestRate,

  //       repaymentCycle,
  //     });

  //   pendingInterest +=
  //     interest.interestAmount;

  //   /**
  //    * Monthly fine.
  //    */
  //   const monthlyFine =
  //     calculateMonthlyFine({
  //       disbursedDate:
  //         loan.disbursedDate,

  //       repaymentCycle,

  //       expectedMonthlyRepayment:
  //         loan.expectedMonthlyRepayment,

  //       /**
  //        * Updated after allocation.
  //        */
  //       principalPaidThisMonth: 0,
  //     });

  //   if (
  //     monthlyFine.isApplicable
  //   ) {
  //     pendingLoanFine +=
  //       monthlyFine.fineAmount;
  //   }

  //   /**
  //    * Allocate payment.
  //    */
  //   const allocation =
  //     allocateLoanPayment({
  //       payment:
  //         repayment.amountPaid,

  //       outstandingPrincipal,

  //       outstandingInterest:
  //         pendingInterest,

  //       outstandingFine:
  //         pendingLoanFine,
  //     });

  //   const {
  //     paidPrincipal,
  //     paidInterest,
  //     paidLoanFine,
  //   } = allocation;

  //   /**
  //    * Update balances.
  //    */
  //   paidLoanFine;

  //   const balances =
  //     updateOutstandingBalance({
  //       outstandingPrincipal,

  //       pendingInterest,

  //       pendingLoanFine,

  //       paidPrincipal,

  //       paidInterest,

  //       paidLoanFine,
  //     });

  //   outstandingPrincipal =
  //     balances.outstandingPrincipal;

  //   pendingInterest =
  //     balances.pendingInterest;

  //   pendingLoanFine =
  //     balances.pendingLoanFine;

  //   /**
  //    * Replace monthly fine with the
  //    * actual principal repayment.
  //    */
  //   const recalculatedFine =
  //     calculateMonthlyFine({
  //       disbursedDate:
  //         loan.disbursedDate,

  //       repaymentCycle,

  //       expectedMonthlyRepayment:
  //         loan.expectedMonthlyRepayment,

  //       principalPaidThisMonth:
  //         paidPrincipal,
  //     });

  //   /**
  //    * Adjust fine if necessary.
  //    */
  //   if (
  //     recalculatedFine.isApplicable
  //   ) {
  //     const difference =
  //       recalculatedFine.fineAmount -
  //       monthlyFine.fineAmount;

  //     pendingLoanFine +=
  //       difference;
  //   }

  //   entries.push(
  //     createLedgerEntry({
  //       transactionDate:
  //         repayment.meetingDate,

  //       meetingId:
  //         repayment.meetingId,

  //       amountPaid:
  //         repayment.amountPaid,

  //       interestDays:
  //         interest.interestDays,

  //       interestCharged:
  //         interest.interestAmount,

  //       loanFineCharged:
  //         recalculatedFine.fineAmount,

  //       paidPrincipal,

  //       paidInterest,

  //       paidLoanFine,

  //       outstandingPrincipal,

  //       pendingInterest,

  //       pendingLoanFine,

  //       remainingAmount:
  //         allocation.remainingAmount,
  //     }),
  //   );

  //   previousRepaymentDate =
  //     repayment.meetingDate;
  // }

  const balances = processRepayments({
    loan,

    repayments,

    entries,

    outstandingPrincipal,

    pendingInterest,

    pendingLoanFine,
  });

  outstandingPrincipal = balances.outstandingPrincipal;

  pendingInterest = balances.pendingInterest;

  pendingLoanFine = balances.pendingLoanFine;

  const passbook = {
    loanId: loan._id.toString(),

    loanNumber: loan.loanNumber,

    memberId: loan.memberId.toString(),

    memberName: loan.memberName,

    loanType: loan.loanType,

    disbursedAmount: loan.disbursedAmount,

    disbursedDate: loan.disbursedDate,

    entries,
  };

  validateLoanPassbook(passbook);

  return passbook;
}
