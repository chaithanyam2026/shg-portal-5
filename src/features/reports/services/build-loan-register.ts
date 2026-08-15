import connectMongo from "@/lib/db/mongodb";
import { toCalendarDate } from "@/lib/utils/date";
import { Types } from "mongoose";

import { calculateLoanSummary } from "@/features/loans/domain";
import { LOAN_TYPES } from "@/features/loans/domain/loan-type";
import { buildLoanLedger } from "@/features/loans/services/internal/loan-ledger";
import { loadRepaymentsForMembers } from "@/features/loans/services/internal/meeting-loader";
import type {
  LoanRegister,
  LoanRegisterGroup,
  LoanRegisterRow,
  LoanRegisterTotals,
} from "@/features/reports/domain/loan-register";
import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";

const LOAN_TYPE_LABELS: Record<(typeof LOAN_TYPES)[number], string> = {
  NORMAL: "Normal Loans",
  SPECIAL: "Special Loans",
};

function createEmptyTotals(): LoanRegisterTotals {
  return {
    count: 0,
    disbursedAmount: 0,
    paidPrincipal: 0,
    paidInterest: 0,
    paidLoanFine: 0,
    outstandingPrincipal: 0,
    pendingInterest: 0,
    pendingLoanFine: 0,
    totalOutstanding: 0,
  };
}

function addRowToTotals(totals: LoanRegisterTotals, row: LoanRegisterRow): void {
  totals.count += 1;
  totals.disbursedAmount += row.disbursedAmount;
  totals.paidPrincipal += row.paidPrincipal;
  totals.paidInterest += row.paidInterest;
  totals.paidLoanFine += row.paidLoanFine;
  totals.outstandingPrincipal += row.outstandingPrincipal;
  totals.pendingInterest += row.pendingInterest;
  totals.pendingLoanFine += row.pendingLoanFine;
  totals.totalOutstanding += row.totalOutstanding;
}

export async function buildLoanRegister(financialYearId: string): Promise<LoanRegister> {
  await connectMongo();

  const financialYear = await FinancialYear.findById(financialYearId).select("endDate").lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  const financialYearEndDate = toCalendarDate(financialYear.endDate);

  const loans = await Loan.find({
    financialYearId: new Types.ObjectId(financialYearId),
  })
    .populate<{
      memberId: {
        _id: Types.ObjectId;
        memberCode: string;
        name: string;
      };
    }>({
      path: "memberId",
      select: "memberCode name",
    })
    .sort({
      loanType: 1,
      disbursedDate: 1,
      loanNumber: 1,
    })
    .lean();

  const memberIds = [...new Set(loans.map((loan) => loan.memberId._id.toString()))];

  const repaymentsByMember = await loadRepaymentsForMembers({
    memberIds,
  });

  const rows: LoanRegisterRow[] = await Promise.all(
    loans.map(async (loan) => {
      const member = loan.memberId;
      const memberId = member._id.toString();

      const passbook = await buildLoanLedger(
        {
          _id: loan._id,
          loanNumber: loan.loanNumber,
          memberId: member._id,
          memberName: member.name,
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

      const summary = calculateLoanSummary(passbook);

      return {
        loanId: loan._id.toString(),
        loanNumber: loan.loanNumber,
        memberId,
        memberCode: member.memberCode,
        memberName: member.name,
        loanType: loan.loanType,
        status: loan.status,
        disbursedDate: loan.disbursedDate.toISOString(),
        expiryDate: loan.expiryDate?.toISOString() ?? null,
        disbursedAmount: loan.disbursedAmount,
        interestRate: loan.interestRate,
        paidPrincipal: summary.paidPrincipal,
        paidInterest: summary.paidInterest,
        paidLoanFine: summary.paidLoanFine,
        outstandingPrincipal: summary.outstandingPrincipal,
        pendingInterest: summary.pendingInterest,
        pendingLoanFine: summary.pendingLoanFine,
        totalOutstanding: summary.totalPayable,
      };
    }),
  );

  const groups: LoanRegisterGroup[] = LOAN_TYPES.map((loanType) => {
    const groupRows = rows.filter((row) => row.loanType === loanType);
    const totals = createEmptyTotals();

    for (const row of groupRows) {
      addRowToTotals(totals, row);
    }

    return {
      loanType,
      label: LOAN_TYPE_LABELS[loanType],
      rows: groupRows,
      totals,
    };
  }).filter((group) => group.rows.length > 0);

  const totals = createEmptyTotals();

  for (const row of rows) {
    addRowToTotals(totals, row);
  }

  return {
    financialYearId,
    groups,
    totals,
  };
}
