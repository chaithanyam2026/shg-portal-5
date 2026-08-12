import connectMongo from "@/lib/db/mongodb";

import FinancialYear, { FinancialYearDocument } from "@/models/FinancialYear";
import { mapFinancialYearSummary } from "./internal";

/**
 * Returns the currently active
 * financial year.
 */
export async function getActiveFinancialYear(): Promise<FinancialYearDocument | null> {
  await connectMongo();

  const financialYear = await FinancialYear.findOne({
    status: "IN_PROGRESS",
  }).lean();

  if (!financialYear) {
    return null;
  }

  return financialYear;
  // return mapFinancialYearSummary(
  //   financialYear,
  // );
}
