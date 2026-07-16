import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import {
  getActiveFinancialYear,
} from "./get-active";

/**
 * Returns the selected financial
 * year.
 *
 * If no id is supplied,
 * the current IN_PROGRESS year
 * is returned.
 */
export async function getSelectedFinancialYear(
  financialYearId?: string,
) {
  if (!financialYearId) {
    return getActiveFinancialYear();
  }

  await connectMongo();

  const financialYear =
    await FinancialYear.findById(
      financialYearId,
    ).lean();

  if (!financialYear) {
    throw new Error(
      "Financial year not found.",
    );
  }

  return financialYear;
}