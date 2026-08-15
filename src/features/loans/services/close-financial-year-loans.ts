import { Types } from "mongoose";

import { AppError } from "@/lib/errors";
import { toCalendarDate } from "@/lib/utils/date";
import FinancialYear from "@/models/FinancialYear";
import Loan from "@/models/Loan";

import { ACTIVE_LOAN_STATUS, CLOSED_LOAN_STATUS } from "../domain";

import { ensureLoanSanctionedDate } from "./internal/ensure-loan-sanctioned-date";

const AUTO_CLOSE_REMARK = "Closed automatically when the next financial year started.";

/**
 * Marks all active loans in a financial year as closed.
 *
 * Used during financial year activation so loan balances can roll
 * forward through opening balances in the new year.
 */
export async function closeFinancialYearLoans(financialYearId: string): Promise<number> {
  if (!Types.ObjectId.isValid(financialYearId)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  const financialYear = await FinancialYear.findById(financialYearId).select("endDate").lean();

  if (!financialYear) {
    throw new AppError("Financial year not found.", 404);
  }

  const closedDate = toCalendarDate(financialYear.endDate);

  const activeLoans = await Loan.find({
    financialYearId,
    status: ACTIVE_LOAN_STATUS,
  });

  if (activeLoans.length === 0) {
    return 0;
  }

  let closedCount = 0;

  for (const loan of activeLoans) {
    loan.status = CLOSED_LOAN_STATUS;
    loan.closedDate = closedDate;

    if (loan.remarks.trim().length === 0) {
      loan.remarks = AUTO_CLOSE_REMARK;
    } else if (!loan.remarks.includes(AUTO_CLOSE_REMARK)) {
      loan.remarks = `${loan.remarks}\n${AUTO_CLOSE_REMARK}`;
    }

    ensureLoanSanctionedDate(loan);

    await loan.save();
    closedCount += 1;
  }

  return closedCount;
}

export async function countActiveLoansInFinancialYear(financialYearId: string): Promise<number> {
  if (!Types.ObjectId.isValid(financialYearId)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  return Loan.countDocuments({
    financialYearId,
    status: ACTIVE_LOAN_STATUS,
  });
}

export async function countActiveLoansOutsideFinancialYear(
  financialYearId: string,
): Promise<number> {
  if (!Types.ObjectId.isValid(financialYearId)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  return Loan.countDocuments({
    financialYearId: {
      $ne: financialYearId,
    },
    status: ACTIVE_LOAN_STATUS,
  });
}
