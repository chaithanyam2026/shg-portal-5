import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAdminRole } from "@/lib/auth/roles";
import { AppError } from "@/lib/errors";

import type { FinancialYearOption } from "../domain/financial-year-option";
import { getSelectedFinancialYear, type SelectedFinancialYear } from "./get-selected";
import { listReportFinancialYearOptions } from "./list-report-options";

export type ReportFinancialYearSelection = {
  financialYear: SelectedFinancialYear | null;
  options: FinancialYearOption[];
};

export async function canCurrentUserAccessReportFinancialYear(
  financialYearId: string,
): Promise<boolean> {
  const session = await auth();

  if (isAdminRole(session?.user?.role)) {
    return true;
  }

  const options = await listReportFinancialYearOptions();

  return options.some((option) => option.id === financialYearId);
}

export async function assertCanAccessReportFinancialYear(financialYearId: string): Promise<void> {
  if (await canCurrentUserAccessReportFinancialYear(financialYearId)) {
    return;
  }

  throw new AppError(
    "You can only view reports for financial years where you are president, secretary, or treasurer.",
    403,
  );
}

/**
 * Resolves the report financial year and dropdown options for the current user.
 * Unauthorized query params redirect to /forbidden.
 */
export async function loadReportFinancialYear(
  financialYearId?: string,
): Promise<ReportFinancialYearSelection> {
  const options = await listReportFinancialYearOptions();

  if (financialYearId) {
    if (!options.some((option) => option.id === financialYearId)) {
      redirect("/forbidden");
    }

    return {
      financialYear: await getSelectedFinancialYear(financialYearId),
      options,
    };
  }

  if (options.length === 0) {
    const session = await auth();

    if (isAdminRole(session?.user?.role)) {
      redirect("/financial-years");
    }

    return {
      financialYear: null,
      options,
    };
  }

  const preferred = await getSelectedFinancialYear();

  if (preferred && options.some((option) => option.id === preferred._id)) {
    return {
      financialYear: preferred,
      options,
    };
  }

  return {
    financialYear: await getSelectedFinancialYear(options[0].id),
    options,
  };
}
