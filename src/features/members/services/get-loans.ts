import { Types } from "mongoose";

import { buildLoanLedger } from "@/features/loans/services/internal/loan-ledger";
import { loadRepaymentsForMembers } from "@/features/loans/services/internal/meeting-loader";
import connectMongo from "@/lib/db/mongodb";
import { toCalendarDate, toIsoString } from "@/lib/utils/date";
import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";

export async function getMemberLoans(memberId: string, financialYearId?: string) {
  await connectMongo();

  const query: Record<string, unknown> = {
    memberId: new Types.ObjectId(memberId),
  };

  if (financialYearId) {
    query.financialYearId = new Types.ObjectId(financialYearId);
  }

  const loans = await Loan.find(query)
    .sort({
      disbursedDate: -1,
      loanNumber: 1,
    })
    .lean();

  if (loans.length === 0) {
    return [];
  }

  const repaymentsByMember = await loadRepaymentsForMembers({
    memberIds: [memberId],
  });
  const repayments = repaymentsByMember.get(memberId) ?? [];

  const financialYearIds = [
    ...new Set(loans.map((loan) => loan.financialYearId.toString())),
  ];
  const financialYears = await FinancialYear.find({
    _id: { $in: financialYearIds.map((id) => new Types.ObjectId(id)) },
  })
    .select("endDate")
    .lean();
  const endDateByYear = new Map(
    financialYears.map((year) => [year._id.toString(), year.endDate]),
  );

  return Promise.all(
    loans.map(async (loan) => {
      const financialYearEndDate = endDateByYear.get(loan.financialYearId.toString());
      let outstandingPrincipal = loan.disbursedAmount;

      if (financialYearEndDate) {
        try {
          const passbook = await buildLoanLedger(
            {
              _id: loan._id,
              loanNumber: loan.loanNumber,
              memberId: loan.memberId,
              memberName: "",
              loanType: loan.loanType,
              disbursedAmount: loan.disbursedAmount,
              interestRate: loan.interestRate,
              expectedMonthlyRepayment: loan.expectedMonthlyRepayment,
              disbursedDate: loan.disbursedDate,
              closedDate: loan.closedDate,
              financialYearEndDate: toCalendarDate(financialYearEndDate),
            },
            repayments,
          );

          outstandingPrincipal =
            passbook.entries.at(-1)?.outstandingPrincipal ?? loan.disbursedAmount;
        } catch {
          outstandingPrincipal = loan.disbursedAmount;
        }
      }

      return {
        _id: loan._id.toString(),
        loanNumber: loan.loanNumber,
        loanType: loan.loanType,
        status: loan.status,
        disbursedAmount: loan.disbursedAmount,
        disbursedDate: toIsoString(loan.disbursedDate) ?? "",
        outstandingPrincipal,
      };
    }),
  );
}
