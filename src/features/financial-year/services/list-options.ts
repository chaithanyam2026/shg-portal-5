import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import type { FinancialYearOption } from "../domain/financial-year-option";

/**
 * Returns financial years for the
 * selector.
 */
export async function listFinancialYearOptions(): Promise<FinancialYearOption[]> {
  await connectMongo();

  const years = await FinancialYear.find({})
    .sort({
      startDate: -1,
    })
    .select("name status")
    .lean();

  return years.map((year) => ({
    id: year._id.toString(),

    name: year.name,

    status: year.status,
  }));
}
