import { AppError } from "@/lib/errors";

import { canEditFinancialYearFields } from "../domain/office-bearers";
import type { FinancialYearStatus } from "../domain/financial-year-status";
import { getCurrentMemberId } from "@/lib/auth/current-member";

type FinancialYearEditGuardInput = {
  status: FinancialYearStatus;
  executiveCommittee?: {
    president?: unknown;
    secretary?: unknown;
    treasurer?: unknown;
  } | null;
};

/**
 * Blocks edits when the year is closed/approved, or when an
 * in-progress year is edited by anyone other than its president,
 * secretary, or treasurer.
 */
export async function assertCanEditFinancialYearFields(
  financialYear: FinancialYearEditGuardInput,
): Promise<void> {
  const memberId = await getCurrentMemberId();

  if (
    canEditFinancialYearFields({
      status: financialYear.status,
      committee: financialYear.executiveCommittee,
      memberId,
    })
  ) {
    return;
  }

  if (financialYear.status === "IN_PROGRESS") {
    throw new AppError(
      "Only the president, secretary, or treasurer of this financial year can edit these fields.",
      403,
    );
  }

  throw new AppError("Financial year cannot be modified.", 400);
}
