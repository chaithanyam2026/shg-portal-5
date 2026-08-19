import { Types } from "mongoose";

import { SPECIAL_LOAN_TYPE } from "@/features/loans/domain/loan-type";
import { buildLoanLedger } from "@/features/loans/services/internal/loan-ledger";
import { loadRepaymentsForMembers } from "@/features/loans/services/internal/meeting-loader";
import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";

export type MemberLoanOutstanding = {
  outstandingPrincipal: number;
  outstandingSpecialLoan: number;
};

/**
 * Current outstanding principal per member (last passbook outstanding value).
 */
export async function loadOutstandingPrincipals(
  financialYearId: string,
): Promise<Map<string, MemberLoanOutstanding>> {
  const outstandingByMember = new Map<string, MemberLoanOutstanding>();

  const [financialYear, loans] = await Promise.all([
    FinancialYear.findById(financialYearId).select("endDate").lean(),
    Loan.find({
      financialYearId: new Types.ObjectId(financialYearId),
    })
      .select({
        loanNumber: 1,
        memberId: 1,
        loanType: 1,
        disbursedAmount: 1,
        interestRate: 1,
        expectedMonthlyRepayment: 1,
        disbursedDate: 1,
        closedDate: 1,
      })
      .lean(),
  ]);

  if (!financialYear || loans.length === 0) {
    return outstandingByMember;
  }

  const memberIds = [...new Set(loans.map((loan) => loan.memberId.toString()))];
  const repaymentsByMember = await loadRepaymentsForMembers({ memberIds });

  for (const loan of loans) {
    const memberId = loan.memberId.toString();
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
        financialYearEndDate: financialYear.endDate,
      },
      repaymentsByMember.get(memberId) ?? [],
    );

    const lastOutstanding = passbook.entries.at(-1)?.outstandingPrincipal ?? loan.disbursedAmount;
    const current = outstandingByMember.get(memberId) ?? {
      outstandingPrincipal: 0,
      outstandingSpecialLoan: 0,
    };

    current.outstandingPrincipal += lastOutstanding;

    if (loan.loanType === SPECIAL_LOAN_TYPE) {
      current.outstandingSpecialLoan += lastOutstanding;
    }

    outstandingByMember.set(memberId, current);
  }

  return outstandingByMember;
}
