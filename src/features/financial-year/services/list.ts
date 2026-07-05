import FinancialYear from "@/models/FinancialYear";

/**
 * List Financial Years
 *
 * Returns newest financial years first.
 */
export async function list() {
  return FinancialYear.find()
    .select({
      name: 1,
      status: 1,
      startDate: 1,
      endDate: 1,
      createdAt: 1,
    })
    .sort({
      startDate: -1,
    })
    .lean();
}