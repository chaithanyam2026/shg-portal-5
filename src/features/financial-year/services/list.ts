import connectMongo from "@/lib/db/mongodb";
import { CACHE_TAGS, remember } from "@/lib/cache";

import FinancialYear from "@/models/FinancialYear";

import type { FinancialYearSummary } from "../types";
import { mapFinancialYearSummary } from "./internal";

async function queryFinancialYears(): Promise<FinancialYearSummary[]> {
  await connectMongo();

  const financialYears = await FinancialYear.find()
    .select({
      name: 1,
      status: 1,
      startDate: 1,
      endDate: 1,
    })
    .sort({
      startDate: -1,
    })
    .lean();

  return financialYears.map(mapFinancialYearSummary);
}

/**
 * List Financial Years
 *
 * Returns newest financial years first.
 */
export const listFinancialYears = remember(queryFinancialYears, {
  key: "financial-years-list",
  tags: [CACHE_TAGS.financialYears],
  revalidate: 60,
});
