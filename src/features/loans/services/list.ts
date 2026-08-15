import connectMongo from "@/lib/db/mongodb";
import { toCalendarDate } from "@/lib/utils/date";
import { Types } from "mongoose";

import Loan from "@/models/Loan";

import { calculateLoanSummary } from "../domain";

import type { LoanSummary } from "../types";

import type { LoanStatus } from "../domain/loan-status";

import type { LoanType } from "../domain/loan-type";

import { toIsoString } from "@/lib/utils/date";

import { ObjectIdSchema } from "../validation";

import { buildLoanLedger } from "./internal/loan-ledger";
import { loadRepaymentsForMembers } from "./internal/meeting-loader";

type ListLoansInput = {
  financialYearId?: string;

  memberId?: string;

  loanType?: LoanType;

  status?: LoanStatus;

  search?: string;
};

export async function listLoans(filters: ListLoansInput = {}): Promise<LoanSummary[]> {
  await connectMongo();

  const query: Record<string, unknown> = {};

  if (filters.financialYearId) {
    query.financialYearId = ObjectIdSchema.parse(filters.financialYearId);
  }

  if (filters.memberId) {
    query.memberId = ObjectIdSchema.parse(filters.memberId);
  }

  if (filters.loanType) {
    query.loanType = filters.loanType;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  const loans = await Loan.find(query)
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
    .populate<{
      financialYearId: {
        _id: Types.ObjectId;
        name: string;
        endDate: Date;
      };
    }>({
      path: "financialYearId",
      select: "name endDate",
    })
    .sort({
      disbursedDate: -1,
    })
    .lean();

  let filteredLoans = loans;

  if (filters.search?.trim()) {
    const search = filters.search.trim().toLowerCase();

    filteredLoans = loans.filter((loan) => {
      const member = loan.memberId;

      return (
        loan.loanNumber.toLowerCase().includes(search) ||
        member.memberCode.toLowerCase().includes(search) ||
        member.name.toLowerCase().includes(search)
      );
    });
  }

  const memberIds = filteredLoans.map((loan) => loan.memberId._id.toString());

  const repaymentsByMember = await loadRepaymentsForMembers({
    memberIds,
  });

  return Promise.all(
    filteredLoans.map(async (loan) => {
      const member = loan.memberId;

      const financialYear = loan.financialYearId;

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
          financialYearEndDate: toCalendarDate(financialYear.endDate),
        },
        repaymentsByMember.get(memberId) ?? [],
      );

      const summary = calculateLoanSummary(passbook);

      return {
        _id: loan._id.toString(),

        loanNumber: loan.loanNumber,

        loanType: loan.loanType,

        status: loan.status,

        financialYearId: financialYear._id.toString(),

        financialYearName: financialYear.name,

        memberId,

        memberCode: member.memberCode,

        memberName: member.name,

        sanctionedAmount: loan.sanctionedAmount,

        disbursedAmount: loan.disbursedAmount,

        interestRate: loan.interestRate,

        expectedMonthlyRepayment: loan.expectedMonthlyRepayment,

        sanctionedDate:
          toIsoString(loan.sanctionedDate) ?? toIsoString(loan.disbursedDate) ?? "",

        disbursedDate: toIsoString(loan.disbursedDate) ?? "",

        closedDate: toIsoString(loan.closedDate),

        expiryDate: toIsoString(loan.expiryDate),

        outstandingPrincipal: summary.outstandingPrincipal,

        totalPayable: summary.totalPayable,
      };
    }),
  );
}
