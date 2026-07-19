import connectMongo from "@/lib/db/mongodb";
import { Types } from "mongoose";

import Loan from "@/models/Loan";

import type { LoanSummary } from "../types";

import type { LoanStatus } from "../domain/loan-status";

import type { LoanType } from "../domain/loan-type";

import { ObjectIdSchema } from "../validation";

type ListLoansInput = {
  financialYearId?: string;

  memberId?: string;

  loanType?: LoanType;

  status?: LoanStatus;

  search?: string;
};

type StringifiableId = {
  toString(): string;
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
      };
    }>({
      path: "financialYearId",
      select: "name",
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

  return filteredLoans.map((loan) => {
    const member = loan.memberId;

    const financialYear = loan.financialYearId;

    return {
      _id: loan._id.toString(),

      loanNumber: loan.loanNumber,

      loanType: loan.loanType,

      status: loan.status,

      financialYearId: financialYear._id.toString(),

      financialYearName: financialYear.name,

      memberId: member._id.toString(),

      memberCode: member.memberCode,

      memberName: member.name,

      sanctionedAmount: loan.sanctionedAmount,

      disbursedAmount: loan.disbursedAmount,

      interestRate: loan.interestRate,

      expectedMonthlyRepayment: loan.expectedMonthlyRepayment,

      disbursedDate: loan.disbursedDate.toISOString(),

      /**
       * These values are calculated by
       * the Loan Ledger service.
       *
       * They are placeholders until the
       * summary engine is integrated.
       */
      outstandingPrincipal: loan.disbursedAmount,

      totalPayable: loan.disbursedAmount,
    };
  });
}
