import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import type { ClosingValidation } from "../../domain";

import { collectYearEndValidationItems } from "./collect-year-end-validation-items";

/**
 * Validates whether a financial year can be closed.
 */
export async function validateFinancialYearClose(
  financialYearId: string,
): Promise<ClosingValidation> {
  await connectMongo();

  const financialYearObjectId = new Types.ObjectId(financialYearId);

  const financialYear = await FinancialYear.findById(financialYearObjectId).lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  const items = [
    {
      code: "FINANCIAL_YEAR_APPROVED",
      title: "Financial Year Approved",
      valid: financialYear.status === "APPROVED",
      message:
        financialYear.status === "APPROVED"
          ? "OK"
          : "Financial year must be APPROVED before closing.",
    },
    ...(await collectYearEndValidationItems(financialYear)),
  ];

  return {
    valid: items.every((item) => item.valid),
    items,
  };
}
