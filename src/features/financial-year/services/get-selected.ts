import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import { getActiveFinancialYear } from "./get-active";

export type SelectedFinancialYear = {
  _id: string;
  name: string;
};

function mapSelectedFinancialYear(financialYear: {
  _id: { toString(): string };
  name: string;
}): SelectedFinancialYear {
  return {
    _id: financialYear._id.toString(),
    name: String(financialYear.name),
  };
}

/**
 * Returns the selected financial year.
 *
 * Priority when no id is supplied:
 * 1. IN_PROGRESS financial year
 * 2. Most recent financial year by start date
 */
export async function getSelectedFinancialYear(
  financialYearId?: string,
): Promise<SelectedFinancialYear | null> {
  if (financialYearId) {
    await connectMongo();

    const financialYear = await FinancialYear.findById(financialYearId)
      .select({
        name: 1,
      })
      .lean();

    if (!financialYear) {
      throw new Error("Financial year not found.");
    }

    return mapSelectedFinancialYear(financialYear);
  }

  const activeFinancialYear = await getActiveFinancialYear();

  if (activeFinancialYear) {
    return mapSelectedFinancialYear(activeFinancialYear);
  }

  await connectMongo();

  const latestFinancialYear = await FinancialYear.findOne()
    .sort({
      startDate: -1,
    })
    .select({
      name: 1,
    })
    .lean();

  if (!latestFinancialYear) {
    return null;
  }

  return mapSelectedFinancialYear(latestFinancialYear);
}
