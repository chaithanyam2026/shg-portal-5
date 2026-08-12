import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";

/**
 * Returns financial years where the member
 * is enrolled.
 */
export async function listMemberFinancialYearOptions(
  memberId: string,
): Promise<FinancialYearOption[]> {
  await connectMongo();

  const years = await FinancialYear.find({
    "members.memberId": memberId,
  })
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

export function getDefaultMemberFinancialYearId(options: FinancialYearOption[]): string | null {
  if (options.length === 0) {
    return null;
  }

  const inProgress = options.find((option) => option.status === "IN_PROGRESS");

  return inProgress?.id ?? options[0].id;
}
