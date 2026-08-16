import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";

import type { ClosingValidation } from "../domain";

import { assertNoOtherReviewFinancialYear } from "./internal/assert-financial-year-lifecycle";
import { mapFinancialYearDetails } from "./internal";
import { populateFinancialYear } from "./internal/populate-financial-year";
import { validateFinancialYearApprove } from "./internal/validate-approve";

export async function getFinancialYearApproveValidation(
  financialYearId: string,
): Promise<ClosingValidation> {
  if (!Types.ObjectId.isValid(financialYearId)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  return validateFinancialYearApprove(financialYearId);
}

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

  const validation = await validateFinancialYearApprove(id);

  if (!validation.valid) {
    const failedMessage = validation.items
      .filter((item) => !item.valid)
      .map((item) => item.message)
      .join(" ");

    throw new AppError(failedMessage || "Financial year cannot be approved.", 400);
  }

  await assertNoOtherReviewFinancialYear(id);

  financialYear.status = "APPROVED";

  await financialYear.save();

  const populatedFinancialYear = await populateFinancialYear(financialYear);

  const { revalidateFinancialYearWrites } = await import("@/lib/cache");
  revalidateFinancialYearWrites();

  return mapFinancialYearDetails(populatedFinancialYear);
}
