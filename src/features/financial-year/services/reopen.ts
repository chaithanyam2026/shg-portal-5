import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/guards";

import FinancialYear from "@/models/FinancialYear";

import { canReopenFinancialYear } from "../domain/financial-year-lifecycle";
import { FINANCIAL_YEAR_STATUS } from "../domain/financial-year-status";
import { mapFinancialYearDetails } from "./internal";
import { populateFinancialYear } from "./internal/populate-financial-year";

export async function reopenFinancialYear(id: string) {
  await connectMongo();
  await requireRole(ADMIN_ROLES);

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  const financialYear = await FinancialYear.findById(id);

  if (!financialYear) {
    throw new AppError("Financial year not found.", 404);
  }

  if (!canReopenFinancialYear(financialYear.status)) {
    throw new AppError("Only closed financial years can be reopened.", 400);
  }

  const inProgressYear = await FinancialYear.findOne({
    _id: { $ne: financialYear._id },
    status: FINANCIAL_YEAR_STATUS.IN_PROGRESS,
  })
    .select("name")
    .lean();

  financialYear.status = inProgressYear
    ? FINANCIAL_YEAR_STATUS.APPROVED
    : FINANCIAL_YEAR_STATUS.IN_PROGRESS;

  await financialYear.save();

  const populatedFinancialYear = await populateFinancialYear(financialYear);

  return mapFinancialYearDetails(populatedFinancialYear);
}
