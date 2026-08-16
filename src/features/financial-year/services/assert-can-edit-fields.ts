import { auth } from "@/auth";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import { isFinancialStewardRole } from "@/lib/auth/roles";
import { AppError } from "@/lib/errors";

import { canEditFinancialYearFields } from "../domain/office-bearers";
import type { FinancialYearStatus } from "../domain/financial-year-status";

type FinancialYearEditGuardInput = {
  status: FinancialYearStatus;
  executiveCommittee?: {
    president?: unknown;
    secretary?: unknown;
    treasurer?: unknown;
  } | null;
};

/**
 * Blocks edits when the year is closed/approved, or when anyone other than
 * an admin, super admin, secretary, treasurer, or this year's president,
 * secretary, or treasurer tries to change fields.
 */
export async function assertCanEditFinancialYearFields(
  financialYear: FinancialYearEditGuardInput,
): Promise<void> {
  const [memberId, session] = await Promise.all([getCurrentMemberId(), auth()]);

  if (
    canEditFinancialYearFields({
      status: financialYear.status,
      committee: financialYear.executiveCommittee,
      memberId,
      isSteward: isFinancialStewardRole(session?.user?.role),
    })
  ) {
    return;
  }

  if (financialYear.status === "APPROVED" || financialYear.status === "CLOSED") {
    throw new AppError("Financial year cannot be modified.", 400);
  }

  throw new AppError(
    "Only the president, secretary, treasurer, admin, or super admin can edit this financial year.",
    403,
  );
}
