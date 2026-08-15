import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import { isOpeningBalanceSourceStatus } from "../../domain/financial-year-lifecycle";

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

  if (!isOpeningBalanceSourceStatus(financialYear.status)) {
    throw new Error(
      "Opening balances can only be generated from a closed, validated, or approved financial year.",
    );
  }

  if (financialYear.status === "CLOSED" && !financialYear.closing) {
    throw new Error("Closing snapshot not found.");
  }
}
