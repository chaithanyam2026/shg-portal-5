import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

/**
 * Validates whether a
 * financial year can be used
 * as the source for opening
 * balances.
 */
export async function validateOpeningBalanceSource(financialYearId: string): Promise<void> {
  await connectMongo();

  const financialYear = await FinancialYear.findById(financialYearId)
    .select({
      name: 1,
      status: 1,
      closing: 1,
    })
    .lean();

  if (!financialYear) {
    throw new Error("Source financial year not found.");
  }

  if (financialYear.status !== "CLOSED") {
    throw new Error("Opening balances can only be generated from a closed financial year.");
  }

  if (!financialYear.closing) {
    throw new Error("Closing snapshot not found.");
  }
}
