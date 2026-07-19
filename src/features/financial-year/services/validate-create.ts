import FinancialYear from "@/models/FinancialYear";

import { FINANCIAL_YEAR_STATUS } from "../domain/financial-year-status";

import type { CreateFinancialYearInput } from "../validation";

export async function validateCreateFinancialYear(input: CreateFinancialYearInput) {
  //
  // Duplicate Name
  //

  const existingName = await FinancialYear.exists({
    name: input.name,
  });

  if (existingName) {
    throw new Error("A financial year with the same name already exists.");
  }

  //
  // Overlapping Date Range
  //

  const overlapping = await FinancialYear.exists({
    startDate: {
      $lte: input.endDate,
    },
    endDate: {
      $gte: input.startDate,
    },
  });

  if (overlapping) {
    throw new Error("Financial year dates overlap with an existing financial year.");
  }

  //
  // Source Already Used
  //

  if (!input.sourceFinancialYearId) {
    return;
  }

  const alreadyCreated = await FinancialYear.exists({
    sourceFinancialYearId: input.sourceFinancialYearId,
  });

  if (alreadyCreated) {
    throw new Error("The selected financial year has already been used.");
  }

  //
  // Source Financial Year
  //

  const source = await FinancialYear.findById(input.sourceFinancialYearId);

  if (!source) {
    throw new Error("Source financial year not found.");
  }

  if (source.status !== FINANCIAL_YEAR_STATUS.CLOSED) {
    throw new Error("Source financial year must be closed.");
  }

  if (!source.closing) {
    throw new Error("Closing snapshot not found.");
  }
}
