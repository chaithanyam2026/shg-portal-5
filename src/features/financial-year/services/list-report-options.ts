import { Types } from "mongoose";

import { auth } from "@/auth";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import { isAdminRole } from "@/lib/auth/roles";
import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import type { FinancialYearOption } from "../domain/financial-year-option";
import { officeBearerYearFilter } from "./internal/office-bearer-year-filter";
import { listFinancialYearOptions } from "./list-options";

function mapFinancialYearOptions(
  years: Array<{
    _id: { toString(): string };
    name: string;
    status: FinancialYearOption["status"];
  }>,
): FinancialYearOption[] {
  return years.map((year) => ({
    id: year._id.toString(),
    name: year.name,
    status: year.status,
  }));
}

/**
 * Report dropdown years: admins see every financial year.
 * President, secretary, and treasurer see only years they are assigned to.
 * Years without an executive committee are hidden from members.
 */
export async function listReportFinancialYearOptions(): Promise<FinancialYearOption[]> {
  const session = await auth();

  if (isAdminRole(session?.user?.role)) {
    return listFinancialYearOptions();
  }

  const memberId = await getCurrentMemberId();

  if (!memberId || !Types.ObjectId.isValid(memberId)) {
    return [];
  }

  await connectMongo();

  const years = await FinancialYear.find(officeBearerYearFilter(new Types.ObjectId(memberId)))
    .sort({
      startDate: -1,
    })
    .select("name status")
    .lean();

  return mapFinancialYearOptions(years);
}
