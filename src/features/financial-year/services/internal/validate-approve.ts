import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import FinancialYear from "@/models/FinancialYear";

import type { ClosingValidation } from "../../domain";

import { collectYearEndValidationItems } from "./collect-year-end-validation-items";

/**
 * Validates whether a financial year can be approved.
 */
export async function validateFinancialYearApprove(
  financialYearId: string,
): Promise<ClosingValidation> {
  await connectMongo();

  const financialYearObjectId = new Types.ObjectId(financialYearId);

  const financialYear = await FinancialYear.findById(financialYearObjectId).lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  const yearEndItems = await collectYearEndValidationItems(financialYear);

  const items = [
    {
      code: "FINANCIAL_YEAR_VALIDATED",
      title: "Financial Year Validated",
      valid: financialYear.status === "VALIDATED",
      message:
        financialYear.status === "VALIDATED"
          ? "OK"
          : "Only validated financial years can be approved.",
    },
    ...yearEndItems.filter((item) => item.code === "LOANS_CLOSED"),
  ];

  return {
    valid: items.every((item) => item.valid),
    items,
  };
}
