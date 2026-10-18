import { cache } from "react";

import { Types } from "mongoose";

import { auth } from "@/auth";
import { officeBearerYearFilter } from "@/features/financial-year/services/internal/office-bearer-year-filter";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import { isAdminRole } from "@/lib/auth/roles";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";

export type LoanViewScope = {
  canViewAllFinancialYears: boolean;
  memberId: string | null;
  officeBearerFinancialYearIds: string[];
};

async function loadCurrentLoanViewScope(): Promise<LoanViewScope> {
  const [session, memberId] = await Promise.all([auth(), getCurrentMemberId()]);

  if (isAdminRole(session?.user?.role)) {
    return {
      canViewAllFinancialYears: true,
      memberId,
      officeBearerFinancialYearIds: [],
    };
  }

  if (!memberId || !Types.ObjectId.isValid(memberId)) {
    return {
      canViewAllFinancialYears: false,
      memberId: null,
      officeBearerFinancialYearIds: [],
    };
  }

  await connectMongo();

  const years = await FinancialYear.find(officeBearerYearFilter(new Types.ObjectId(memberId)))
    .select("_id")
    .lean();

  return {
    canViewAllFinancialYears: false,
    memberId,
    officeBearerFinancialYearIds: years.map((year) => year._id.toString()).sort(),
  };
}

export const getCurrentLoanViewScope = cache(loadCurrentLoanViewScope);

export async function assertCanViewLoan(input: {
  memberId: string;
  financialYearId: string;
}): Promise<void> {
  const scope = await getCurrentLoanViewScope();

  if (scope.canViewAllFinancialYears) {
    return;
  }

  if (scope.officeBearerFinancialYearIds.includes(input.financialYearId)) {
    return;
  }

  if (scope.memberId && scope.memberId === input.memberId) {
    return;
  }

  throw new AppError("Loan not found.", 404);
}
