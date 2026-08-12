import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";

import { mapFinancialYearDetails } from "./internal";
import { populateFinancialYear } from "./internal/populate-financial-year";

export async function approveFinancialYear(id: string) {
  await connectMongo();

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  const financialYear = await FinancialYear.findById(id);

  if (!financialYear) {
    throw new AppError("Financial year not found.", 404);
  }

  if (financialYear.status !== "VALIDATED") {
    throw new AppError("Only validated financial years can be approved.", 400);
  }

  financialYear.status = "APPROVED";

  await financialYear.save();

  const populatedFinancialYear = await populateFinancialYear(financialYear);

  return mapFinancialYearDetails(populatedFinancialYear);
}
