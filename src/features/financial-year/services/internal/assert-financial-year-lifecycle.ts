import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";

import {
  FINANCIAL_YEAR_STATUS,
  type FinancialYearStatus,
} from "../../domain/financial-year-status";
import { isReviewFinancialYearStatus } from "../../domain/financial-year-lifecycle";

type FinancialYearLifecycleRow = {
  _id: { toString(): string };
  name: string;
  status: FinancialYearStatus;
};

async function listOtherFinancialYears(
  excludeId?: string,
): Promise<FinancialYearLifecycleRow[]> {
  await connectMongo();

  const filter = excludeId ? { _id: { $ne: excludeId } } : {};

  return FinancialYear.find(filter).select({ name: 1, status: 1 }).lean();
}

function findFirstByStatus(
  financialYears: FinancialYearLifecycleRow[],
  status: FinancialYearStatus,
): FinancialYearLifecycleRow | undefined {
  return financialYears.find((financialYear) => financialYear.status === status);
}

export async function assertNoOtherReviewFinancialYear(excludeId: string): Promise<void> {
  const others = await listOtherFinancialYears(excludeId);
  const reviewYear = others.find((financialYear) => isReviewFinancialYearStatus(financialYear.status));

  if (reviewYear) {
    throw new AppError(
      `Only one financial year can be validated or approved at a time. "${reviewYear.name}" is already ${reviewYear.status.toLowerCase()}.`,
      400,
    );
  }
}

export async function assertFinancialYearActivationAllowed(financialYearId: string): Promise<void> {
  const others = await listOtherFinancialYears(financialYearId);

  const inProgressYear = findFirstByStatus(others, FINANCIAL_YEAR_STATUS.IN_PROGRESS);

  if (inProgressYear) {
    throw new AppError(
      `Financial year "${inProgressYear.name}" is still in progress. Finish or close it before starting another year.`,
      400,
    );
  }

  const draftYear = findFirstByStatus(others, FINANCIAL_YEAR_STATUS.DRAFT);

  if (draftYear) {
    throw new AppError(
      `Another draft financial year "${draftYear.name}" already exists. Start or remove it before starting this year.`,
      400,
    );
  }

  const reviewYears = others.filter((financialYear) =>
    isReviewFinancialYearStatus(financialYear.status),
  );

  if (reviewYears.length > 1) {
    throw new AppError("Only one financial year can be validated or approved at a time.", 400);
  }

  const invalidYear = others.find(
    (financialYear) =>
      financialYear.status !== FINANCIAL_YEAR_STATUS.CLOSED &&
      !isReviewFinancialYearStatus(financialYear.status),
  );

  if (invalidYear) {
    throw new AppError(
      `Financial year "${invalidYear.name}" must be closed before starting a new year.`,
      400,
    );
  }
}

export async function assertFinancialYearCreateAllowed(
  sourceFinancialYearId?: string | null,
): Promise<void> {
  const financialYears = await listOtherFinancialYears();

  const draftYear = findFirstByStatus(financialYears, FINANCIAL_YEAR_STATUS.DRAFT);

  if (draftYear) {
    throw new Error(
      `A draft financial year "${draftYear.name}" already exists. Start or remove it before creating another year.`,
    );
  }

  const inProgressYear = findFirstByStatus(financialYears, FINANCIAL_YEAR_STATUS.IN_PROGRESS);

  if (inProgressYear) {
    throw new Error(
      `Financial year "${inProgressYear.name}" is still in progress. Validate and approve it before creating the next year.`,
    );
  }

  const reviewYears = financialYears.filter((financialYear) =>
    isReviewFinancialYearStatus(financialYear.status),
  );

  if (reviewYears.length > 1) {
    throw new Error("Only one financial year can be validated or approved at a time.");
  }

  if (reviewYears.length === 1) {
    const reviewYear = reviewYears[0];

    if (!sourceFinancialYearId || reviewYear._id.toString() !== sourceFinancialYearId) {
      throw new Error(
        `Financial year "${reviewYear.name}" is ${reviewYear.status.toLowerCase()}. Use it as the source year or close it before creating another year.`,
      );
    }
  }

  const invalidYear = financialYears.find(
    (financialYear) =>
      financialYear.status !== FINANCIAL_YEAR_STATUS.CLOSED &&
      !isReviewFinancialYearStatus(financialYear.status) &&
      financialYear._id.toString() !== sourceFinancialYearId,
  );

  if (invalidYear) {
    throw new Error(
      `Financial year "${invalidYear.name}" must be closed before creating a new year.`,
    );
  }
}
