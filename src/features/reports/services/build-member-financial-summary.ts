import connectMongo from "@/lib/db/mongodb";
import { toCalendarDate } from "@/lib/utils/date";
import { Types } from "mongoose";

import { calculateLoanSummary } from "@/features/loans/domain";
import { isNormalLoan, isSpecialLoan } from "@/features/loans/domain/loan-type";
import { buildLoanLedger } from "@/features/loans/services/internal/loan-ledger";
import { loadRepaymentsForMembers } from "@/features/loans/services/internal/meeting-loader";
import { buildMemberPassbook } from "@/features/members/services/internal/member-passbook";
import { WEEKLY_CONTRIBUTION } from "@/features/meetings/domain/payment";
import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";
import Meeting from "@/models/Meeting";
import type { FinancialYearMemberOpening } from "@/models/FinancialYear";

import type {
  MemberFinancialSummary,
  MemberFinancialSummaryRow,
  MemberFinancialSummaryTotals,
} from "../domain/member-financial-summary";

import { buildAttendanceFineRegister } from "./build-attendance-fine-register";

type PopulatedMember = {
  memberId: {
    _id: Types.ObjectId;
    memberCode: string;
    name: string;
  };
  opening: FinancialYearMemberOpening;
};

function createEmptyTotals(): MemberFinancialSummaryTotals {
  return {
    contributionPaid: 0,
    contributionToBePaid: 0,
    outstandingLoan: 0,
    outstandingSpecialLoan: 0,
    loanInterestPaid: 0,
    loanInterestPending: 0,
    loanFinePaid: 0,
    loanFinePending: 0,
    absentFinePaid: 0,
    absentFinePending: 0,
  };
}

function addRowToTotals(
  totals: MemberFinancialSummaryTotals,
  row: MemberFinancialSummaryRow,
): void {
  totals.contributionPaid += row.contributionPaid;
  totals.contributionToBePaid += row.contributionToBePaid;
  totals.outstandingLoan += row.outstandingLoan;
  totals.outstandingSpecialLoan += row.outstandingSpecialLoan;
  totals.loanInterestPaid += row.loanInterestPaid;
  totals.loanInterestPending += row.loanInterestPending;
  totals.loanFinePaid += row.loanFinePaid;
  totals.loanFinePending += row.loanFinePending;
  totals.absentFinePaid += row.absentFinePaid;
  totals.absentFinePending += row.absentFinePending;
}

/**
 * Builds a per-member financial summary for a financial year.
 */
export async function buildMemberFinancialSummary(
  financialYearId: string,
): Promise<MemberFinancialSummary> {
  await connectMongo();

  const financialYear = await FinancialYear.findById(financialYearId)
    .populate<{
      members: PopulatedMember[];
    }>({
      path: "members.memberId",
      select: "memberCode name",
    })
    .lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  const members = financialYear.members;

  const financialYearEndDate = toCalendarDate(financialYear.endDate);

  const memberIds = members.map((member) => member.memberId._id.toString());

  const [meetings, loans, fineRegister, repaymentsByMember] = await Promise.all([
    Meeting.find({
      financialYearId: financialYear._id,
      status: "CLOSED",
    })
      .select({
        meetingDate: 1,
        payments: 1,
      })
      .sort({
        meetingDate: 1,
      })
      .lean(),

    Loan.find({
      financialYearId: financialYear._id,
    }).lean(),

    buildAttendanceFineRegister(financialYearId),

    loadRepaymentsForMembers({
      memberIds,
    }),
  ]);

  const closedMeetingCount = meetings.length;

  const fineByMember = new Map(
    fineRegister.rows.map((row) => [row.memberId, row]),
  );

  const loansByMember = new Map<string, typeof loans>();

  for (const loan of loans) {
    const memberId = loan.memberId.toString();

    const memberLoans = loansByMember.get(memberId) ?? [];

    memberLoans.push(loan);

    loansByMember.set(memberId, memberLoans);
  }

  const loanSummaries = await Promise.all(
    loans.map(async (loan) => {
      const memberId = loan.memberId.toString();

      const member = members.find((item) => item.memberId._id.toString() === memberId);

      const passbook = await buildLoanLedger(
        {
          _id: loan._id,
          loanNumber: loan.loanNumber,
          memberId: loan.memberId,
          memberName: member?.memberId.name ?? "",
          loanType: loan.loanType,
          disbursedAmount: loan.disbursedAmount,
          interestRate: loan.interestRate,
          expectedMonthlyRepayment: loan.expectedMonthlyRepayment,
          disbursedDate: loan.disbursedDate,
          closedDate: loan.closedDate,
          financialYearEndDate,
        },
        repaymentsByMember.get(memberId) ?? [],
      );

      return {
        memberId,
        loanType: loan.loanType,
        expiryDate: loan.expiryDate,
        summary: calculateLoanSummary(passbook),
      };
    }),
  );

  const loanSummaryByMember = new Map<
    string,
    {
      outstandingLoan: number;
      outstandingSpecialLoan: number;
      specialLoanExpiry: string | null;
      loanInterestPaid: number;
      loanInterestPending: number;
      loanFinePaid: number;
      loanFinePending: number;
    }
  >();

  for (const item of loanSummaries) {
    const existing = loanSummaryByMember.get(item.memberId) ?? {
      outstandingLoan: 0,
      outstandingSpecialLoan: 0,
      specialLoanExpiry: null,
      loanInterestPaid: 0,
      loanInterestPending: 0,
      loanFinePaid: 0,
      loanFinePending: 0,
    };

    if (isNormalLoan(item.loanType)) {
      existing.outstandingLoan += item.summary.outstandingPrincipal;
    }

    if (isSpecialLoan(item.loanType)) {
      existing.outstandingSpecialLoan += item.summary.outstandingPrincipal;

      if (item.expiryDate) {
        existing.specialLoanExpiry = item.expiryDate.toISOString();
      }
    }

    existing.loanInterestPaid += item.summary.paidInterest;
    existing.loanInterestPending += item.summary.pendingInterest;
    existing.loanFinePaid += item.summary.paidLoanFine;
    existing.loanFinePending += item.summary.pendingLoanFine;

    loanSummaryByMember.set(item.memberId, existing);
  }

  const rows: MemberFinancialSummaryRow[] = members.map((member) => {
    const memberId = member.memberId._id.toString();
    const openingContribution = member.opening?.contribution ?? 0;

    const passbook = buildMemberPassbook({
      memberId,
      memberCode: member.memberId.memberCode,
      memberName: member.memberId.name,
      financialYearId: financialYear._id.toString(),
      financialYearName: financialYear.name,
      startDate: financialYear.startDate,
      openingContribution,
      meetings,
    });

    const contributionExpected =
      openingContribution + closedMeetingCount * WEEKLY_CONTRIBUTION;

    const contributionPaid = passbook.currentBalance;

    const contributionToBePaid = Math.max(0, contributionExpected - contributionPaid);

    const loanTotals = loanSummaryByMember.get(memberId) ?? {
      outstandingLoan: 0,
      outstandingSpecialLoan: 0,
      specialLoanExpiry: null,
      loanInterestPaid: 0,
      loanInterestPending: 0,
      loanFinePaid: 0,
      loanFinePending: 0,
    };

    const fineRow = fineByMember.get(memberId);

    return {
      memberId,
      memberCode: member.memberId.memberCode,
      memberName: member.memberId.name,
      contributionPaid,
      contributionToBePaid,
      outstandingLoan: loanTotals.outstandingLoan,
      outstandingSpecialLoan: loanTotals.outstandingSpecialLoan,
      specialLoanExpiry: loanTotals.specialLoanExpiry,
      loanInterestPaid: loanTotals.loanInterestPaid,
      loanInterestPending: loanTotals.loanInterestPending,
      loanFinePaid: loanTotals.loanFinePaid,
      loanFinePending: loanTotals.loanFinePending,
      absentFinePaid: fineRow?.paidFine ?? 0,
      absentFinePending: fineRow?.pendingFine ?? 0,
    };
  });

  rows.sort((a, b) => a.memberCode.localeCompare(b.memberCode));

  const totals = createEmptyTotals();

  for (const row of rows) {
    addRowToTotals(totals, row);
  }

  return {
    rows,
    totals,
  };
}
