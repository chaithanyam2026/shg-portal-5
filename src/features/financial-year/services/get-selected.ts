import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import { getActiveFinancialYear } from "./get-active";
import { mapFinancialYearSummary } from "./internal";

export type SelectedFinancialYear = {
  _id: string;
  name: string;
};

/**
 * Returns the selected financial year.
 *
 * If no id is supplied, the current
 * IN_PROGRESS financial year is returned.
 */
export async function getSelectedFinancialYear(
  financialYearId?: string,
): Promise<SelectedFinancialYear> {
  if (!financialYearId) {
    const financialYear = await getActiveFinancialYear();

    return {
      _id: financialYear._id.toString(),

      name: String(financialYear.name),
    };
  }

  await connectMongo();

  const financialYear = await FinancialYear.findById(financialYearId)
    .select({
      name: 1,
    })
    .lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  /* return {
    _id: financialYear._id.toString(),

    name: String(financialYear.name),
  }; */
  return mapFinancialYearSummary(financialYear)
}
