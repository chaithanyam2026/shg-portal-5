import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

/**
 * Returns the currently active
 * financial year.
 */
export async function getActiveFinancialYear() {
  await connectMongo();

  const financialYear =
    await FinancialYear.findOne({
      status: "IN_PROGRESS",
    }).lean();

  if (!financialYear) {
    throw new Error(
      "No active financial year found.",
    );
  }

  return financialYear;
}