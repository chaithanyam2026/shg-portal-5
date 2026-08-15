import { Types } from "mongoose";

import { toCalendarDate } from "@/lib/utils/date";

import { buildLoanLedger } from "@/features/loans/services/internal/loan-ledger";
import { loadRepaymentsForMembers } from "@/features/loans/services/internal/meeting-loader";
import type { IncomeExpenseDetail } from "@/features/reports/domain/income-expense-statement";
import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";
import Member from "@/models/Member";

type LoanIncomeTotals = {
  loanInterest: number;
  loanFine: number;
  interestDetails: IncomeExpenseDetail[];
  fineDetails: IncomeExpenseDetail[];
};

export async function sumLoanIncomeForFinancialYear(
  financialYearId: string,
  meetingIds: ReadonlySet<string>,
): Promise<LoanIncomeTotals> {
  const financialYear = await FinancialYear.findById(financialYearId).select("endDate").lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  const financialYearEndDate = toCalendarDate(financialYear.endDate);

  const loans = await Loan.find({
    financialYearId: new Types.ObjectId(financialYearId),
  }).lean();

  if (loans.length === 0) {
    return {
      loanInterest: 0,
      loanFine: 0,
      interestDetails: [],
      fineDetails: [],
    };
  }

  const memberIds = [...new Set(loans.map((loan) => loan.memberId.toString()))];

  const [members, repaymentsByMember] = await Promise.all([
    Member.find({
      _id: {
        $in: memberIds.map((memberId) => new Types.ObjectId(memberId)),
      },
    })
      .select({
        name: true,
      })
      .lean(),
    loadRepaymentsForMembers({
      memberIds,
    }),
  ]);

  const memberNameById = new Map(
    members.map((member) => [member._id.toString(), member.name]),
  );

  let loanInterest = 0;
  let loanFine = 0;
  const interestDetails: IncomeExpenseDetail[] = [];
  const fineDetails: IncomeExpenseDetail[] = [];

  for (const loan of loans) {
    const memberId = loan.memberId.toString();
    const memberName = memberNameById.get(memberId) ?? "Member";

    const passbook = await buildLoanLedger(
      {
        _id: loan._id,
        loanNumber: loan.loanNumber,
        memberId: loan.memberId,
        memberName,
        loanType: loan.loanType,
        disbursedAmount: loan.disbursedAmount,
        interestRate: loan.interestRate,
        expectedMonthlyRepayment: loan.expectedMonthlyRepayment,
        disbursedDate: loan.disbursedDate,
        financialYearEndDate,
      },
      repaymentsByMember.get(memberId) ?? [],
    );

    for (const entry of passbook.entries) {
      if (!entry.meetingId || !meetingIds.has(entry.meetingId)) {
        continue;
      }

      if (entry.paidInterest > 0) {
        loanInterest += entry.paidInterest;

        interestDetails.push({
          date: entry.transactionDate,
          description: `${loan.loanNumber} — ${memberName} — ${entry.description}`,
          amount: entry.paidInterest,
          meetingId: entry.meetingId,
        });
      }

      if (entry.paidLoanFine > 0) {
        loanFine += entry.paidLoanFine;

        fineDetails.push({
          date: entry.transactionDate,
          description: `${loan.loanNumber} — ${memberName} — ${entry.description}`,
          amount: entry.paidLoanFine,
          meetingId: entry.meetingId,
        });
      }
    }
  }

  return {
    loanInterest,
    loanFine,
    interestDetails,
    fineDetails,
  };
}
