import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import { OPENING_BALANCE_SOURCE_STATUSES, isOpeningBalanceSourceStatus } from "../domain/financial-year-lifecycle";

import type { OpeningBalanceSourceFinancialYearLookup } from "../types";

export async function listOpeningBalanceSourceFinancialYears(): Promise<
  OpeningBalanceSourceFinancialYearLookup[]
> {
  await connectMongo();

  const financialYears = await FinancialYear.find({
    status: {
      $in: OPENING_BALANCE_SOURCE_STATUSES,
    },
  })
    .sort({
      endDate: -1,
    })
    .select({
      name: 1,
      startDate: 1,
      endDate: 1,
      status: 1,
      closing: 1,
      openingBalances: 1,
      members: 1,
    })
    .lean();

  return financialYears.flatMap((financialYear) => {
    if (!isOpeningBalanceSourceStatus(financialYear.status)) {
      return [];
    }

    return [
      {
        _id: financialYear._id.toString(),
        name: String(financialYear.name),
        startDate: financialYear.startDate.toISOString(),
        endDate: financialYear.endDate.toISOString(),
        status: financialYear.status,
        closedAt: financialYear.closing?.closedAt?.toISOString() ?? null,
        memberCount: financialYear.members?.length ?? 0,
        bankBalance: Number(
          financialYear.closing?.summary?.bankBalance ??
            financialYear.openingBalances?.bankBalance ??
            0,
        ),
      },
    ];
  });
}
