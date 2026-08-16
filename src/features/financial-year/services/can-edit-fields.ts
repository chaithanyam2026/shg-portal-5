import { auth } from "@/auth";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import { isFinancialStewardRole } from "@/lib/auth/roles";

import { canEditFinancialYearFields, canManageFinancialYear } from "../domain/office-bearers";
import type { FinancialYearStatus } from "../domain/financial-year-status";

type FinancialYearAccessInput = {
  status: FinancialYearStatus;
  executiveCommittee?: {
    president?: unknown;
    secretary?: unknown;
    treasurer?: unknown;
  } | null;
};

async function getFinancialYearAccessContext() {
  const [memberId, session] = await Promise.all([getCurrentMemberId(), auth()]);

  return {
    memberId,
    isSteward: isFinancialStewardRole(session?.user?.role),
  };
}

export async function canCurrentUserManageFinancialYear(financialYear: {
  executiveCommittee?: {
    president?: unknown;
    secretary?: unknown;
    treasurer?: unknown;
  } | null;
}): Promise<boolean> {
  const { memberId, isSteward } = await getFinancialYearAccessContext();

  return canManageFinancialYear({
    committee: financialYear.executiveCommittee,
    memberId,
    isSteward,
  });
}

export async function canCurrentUserEditFinancialYear(
  financialYear: FinancialYearAccessInput,
): Promise<boolean> {
  const { memberId, isSteward } = await getFinancialYearAccessContext();

  return canEditFinancialYearFields({
    status: financialYear.status,
    committee: financialYear.executiveCommittee,
    memberId,
    isSteward,
  });
}
