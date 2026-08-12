import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import type { ClosedFinancialYearLookup } from "../types";

export async function listClosedFinancialYears(): Promise<ClosedFinancialYearLookup[]> {
  await connectMongo();

  const financialYears = await FinancialYear.find({
    status: "CLOSED",
  })
    .sort({
      endDate: -1,
    })
    .select({
      name: 1,
      startDate: 1,
      endDate: 1,
      closing: 1,
      members: 1,
    })
    .lean();

  return financialYears.map((financialYear): ClosedFinancialYearLookup => ({
    _id: financialYear._id.toString(),

    name: String(financialYear.name),

    startDate: financialYear.startDate.toISOString(),

    endDate: financialYear.endDate.toISOString(),

    closedAt: financialYear.closing?.closedAt?.toISOString() ?? null,

    memberCount: financialYear.members?.length ?? 0,

    bankBalance: Number(financialYear.closing?.summary?.bankBalance ?? 0),
  }));
}
