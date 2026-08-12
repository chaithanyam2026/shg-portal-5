import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import type { ClosingValidation } from "../../domain";

import { collectYearEndValidationItems } from "./collect-year-end-validation-items";

function isEndDatePassed(endDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return today.getTime() > end.getTime();
}

/**
 * Validates whether an in-progress financial year
 * is ready to move to VALIDATED.
 */
export async function validateFinancialYearYearEnd(
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
      code: "FINANCIAL_YEAR_IN_PROGRESS",
      title: "Financial Year In Progress",
      valid: financialYear.status === "IN_PROGRESS",
      message:
        financialYear.status === "IN_PROGRESS"
          ? "OK"
          : "Only in-progress financial years can be validated.",
    },
    {
      code: "END_DATE_PASSED",
      title: "End Date Passed",
      valid: isEndDatePassed(financialYear.endDate),
      message: isEndDatePassed(financialYear.endDate)
        ? "OK"
        : "Financial year end date has not passed yet.",
    },
    ...(await collectYearEndValidationItems(financialYear)),
  ];

  return {
    valid: items.every((item) => item.valid),
    items,
  };
}
