import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";

import type { ClosingValidation } from "../domain";

import { assertNoOtherReviewFinancialYear } from "./internal/assert-financial-year-lifecycle";
import { mapFinancialYearDetails } from "./internal";
import { populateFinancialYear } from "./internal/populate-financial-year";
import { validateFinancialYearYearEnd } from "./internal/validate-year-end";

export async function getFinancialYearYearEndValidation(
  financialYearId: string,
): Promise<ClosingValidation> {
  if (!Types.ObjectId.isValid(financialYearId)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  return validateFinancialYearYearEnd(financialYearId);
}

export async function markFinancialYearValidated(id: string) {
  await connectMongo();

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  const financialYear = await FinancialYear.findById(id);

  if (!financialYear) {
    throw new AppError("Financial year not found.", 404);
  }

  if (financialYear.status !== "IN_PROGRESS") {
    throw new AppError("Only in-progress financial years can be validated.", 400);
  }

  const validation = await validateFinancialYearYearEnd(id);

  if (!validation.valid) {
    throw new AppError("Financial year is not ready to be validated.", 400);
  }

  await assertNoOtherReviewFinancialYear(id);

  financialYear.status = "VALIDATED";

  await financialYear.save();

  const populatedFinancialYear = await populateFinancialYear(financialYear);

  return {
    financialYear: mapFinancialYearDetails(populatedFinancialYear),
    validation,
  };
}
