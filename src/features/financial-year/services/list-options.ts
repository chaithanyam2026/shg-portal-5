import connectMongo from "@/lib/db/mongodb";
import { CACHE_TAGS, remember } from "@/lib/cache";

import FinancialYear from "@/models/FinancialYear";

import type { FinancialYearOption } from "../domain/financial-year-option";

async function queryFinancialYearOptions(): Promise<FinancialYearOption[]> {
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

/**
 * Returns financial years for the
 * selector.
 */
export const listFinancialYearOptions = remember(queryFinancialYearOptions, {
  key: "financial-year-options",
  tags: [CACHE_TAGS.financialYears],
  revalidate: 60,
});
