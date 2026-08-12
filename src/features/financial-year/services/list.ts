import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import type { FinancialYearSummary } from "../types";
import { mapFinancialYearSummary } from "./internal";

/**
 * List Financial Years
 *
 * Returns newest financial years first.
 */
export async function listFinancialYears(): Promise<FinancialYearSummary[]> {
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

  /* return financialYears.map((financialYear): FinancialYearSummary => ({
    _id: financialYear._id.toString(),

    name: String(financialYear.name),

    status: financialYear.status as FinancialYearSummary["status"],

    startDate: financialYear.startDate,

    endDate: financialYear.endDate,
  })); */
  return financialYears.map(
    mapFinancialYearSummary,
  );
}
