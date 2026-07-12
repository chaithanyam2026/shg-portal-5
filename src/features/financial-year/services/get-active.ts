import FinancialYear from "@/models/FinancialYear";

export async function getActiveFinancialYear() {
  return FinancialYear.findOne({
    status: "IN_PROGRESS",
  }).lean();
}