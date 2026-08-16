import { listFinancialYears } from "./list";
import { getFinancialYearCreateBlockReason } from "../domain/financial-year-lifecycle";

export type FinancialYearCreateEligibility = {
  allowed: boolean;
  reason: string | null;
};

export async function getFinancialYearCreateEligibility(): Promise<FinancialYearCreateEligibility> {
  const financialYears = await listFinancialYears();
  const reason = getFinancialYearCreateBlockReason(financialYears);

  return {
    allowed: reason === null,
    reason,
  };
}
