// import Meeting from "@/models/Meeting";
import connectMongo from "@/lib/db/mongodb";
import { toCalendarDate } from "@/lib/utils/date";

import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";

import { loadLoanRepayments, type LoanRepayment } from "./meeting-loader";

import { LOAN_DISBURSED_ENTRY } from "../../domain/passbook-entry-type";

import { processLoanTimeline } from "./process-loan-timeline";

import type { LoanPassbook } from "../../domain/loan-passbook";

import { resolveLoanCalculationEndDate, validateLoanPassbook } from "../../domain";

export type BuildLoanLedgerInput = {
  _id: {
    toString(): string;
  };

  loanNumber: string;

  memberId: {
    toString(): string;
  };

  memberName: string;

  loanType: string;

  disbursedAmount: number;

  interestRate: number;

  expectedMonthlyRepayment: number;

  disbursedDate: Date;

  closedDate?: Date | null;

  financialYearEndDate?: Date;
};

async function resolveFinancialYearEndDate(loan: BuildLoanLedgerInput): Promise<Date> {
  if (loan.financialYearEndDate) {
    return toCalendarDate(loan.financialYearEndDate);
  }

  await connectMongo();

  const loanDocument = await Loan.findById(loan._id).select("financialYearId").lean();

  if (!loanDocument) {
    throw new Error("Loan not found.");
  }

  const financialYear = await FinancialYear.findById(loanDocument.financialYearId)
    .select("endDate")
    .lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  return toCalendarDate(financialYear.endDate);
}

/**
 * Builds the complete loan ledger.
 */
export async function buildLoanLedger(
  loan: BuildLoanLedgerInput,
  repayments?: LoanRepayment[],
): Promise<LoanPassbook> {
  /**
   * Load meetings for the member.
   */
  const loanRepayments =
    repayments ??
    (await loadLoanRepayments({
      memberId: loan.memberId,
    }));

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

      remainingAmount: 0,

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

  const financialYearEndDate = await resolveFinancialYearEndDate(loan);
  const calculationEndDate = resolveLoanCalculationEndDate(financialYearEndDate, loan.closedDate);

  const balances = processLoanTimeline({
    loan,

    repayments: loanRepayments,

    entries,

    outstandingPrincipal,

    pendingInterest,

    pendingLoanFine,

    financialYearEndDate: calculationEndDate,
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

    expectedMonthlyRepayment: loan.expectedMonthlyRepayment,

    disbursedDate: loan.disbursedDate,

    closedDate: loan.closedDate ?? null,

    interestRate: loan.interestRate,

    calculationEndDate,

    entries,
  };

  validateLoanPassbook(passbook);

  return passbook;
}
