import { canEditFinancialYearFields } from "../domain/office-bearers";
import type { FinancialYearStatus } from "../domain/financial-year-status";
import { getCurrentMemberId } from "@/lib/auth/current-member";

export async function canCurrentUserEditFinancialYear(financialYear: {
  status: FinancialYearStatus;
  executiveCommittee?: {
    president?: unknown;
    secretary?: unknown;
    treasurer?: unknown;
  } | null;
}): Promise<boolean> {
  const memberId = await getCurrentMemberId();

  return canEditFinancialYearFields({
    status: financialYear.status,
    committee: financialYear.executiveCommittee,
    memberId,
  });
}
