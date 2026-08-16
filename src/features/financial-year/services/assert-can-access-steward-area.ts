import { Types } from "mongoose";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import { isFinancialStewardRole } from "@/lib/auth/roles";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";

import { FINANCIAL_YEAR_STATUS } from "../domain/financial-year-status";

export async function isCurrentUserFinancialYearOfficeBearer(): Promise<boolean> {
  const memberId = await getCurrentMemberId();

  if (!memberId || !Types.ObjectId.isValid(memberId)) {
    return false;
  }

  await connectMongo();

  const memberObjectId = new Types.ObjectId(memberId);

  const officeBearerYear = await FinancialYear.exists({
    status: {
      $ne: FINANCIAL_YEAR_STATUS.CLOSED,
    },
    $or: [
      { "executiveCommittee.president": memberObjectId },
      { "executiveCommittee.secretary": memberObjectId },
      { "executiveCommittee.treasurer": memberObjectId },
    ],
  });

  return Boolean(officeBearerYear);
}

export async function canCurrentUserAccessFinancialStewardArea(): Promise<boolean> {
  const session = await auth();

  if (isFinancialStewardRole(session?.user?.role)) {
    return true;
  }

  return isCurrentUserFinancialYearOfficeBearer();
}

export async function assertCanAccessFinancialStewardArea(): Promise<void> {
  if (await canCurrentUserAccessFinancialStewardArea()) {
    return;
  }

  throw new AppError(
    "Only the president, secretary, treasurer, admin, or super admin can access this area.",
    403,
  );
}

export async function requireFinancialStewardArea(): Promise<void> {
  if (await canCurrentUserAccessFinancialStewardArea()) {
    return;
  }

  redirect("/forbidden");
}
