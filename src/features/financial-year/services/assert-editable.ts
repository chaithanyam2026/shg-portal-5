import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

/**
 * Ensures the financial year
 * is still editable.
 */
export async function assertFinancialYearEditable(financialYearId: string): Promise<void> {
  await connectMongo();

  const financialYear = await FinancialYear.findById(financialYearId).select("status").lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  if (financialYear.status === "CLOSED") {
    throw new Error("Financial year is closed and cannot be modified.");
  }
}
