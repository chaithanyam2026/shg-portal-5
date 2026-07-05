import FinancialYear from "@/models/FinancialYear";

import {
  CreateFinancialYearInput,
  validateCreateFinancialYear,
} from "../validation";
import { AppError } from "@/lib/errors";

/**
 * Create a Financial Year
 *
 * Business Rules
 * - Name must be unique
 * - Start date must be before end date (validated by Zod)
 * - Financial years must not overlap
 */
export async function create(
  input: unknown,
) {
  const data: CreateFinancialYearInput =
    validateCreateFinancialYear(input);

  /**
   * Unique name
   */
  const existingName = await FinancialYear.exists({
    name: data.name,
  });

  if (existingName) {
    throw new AppError(
      "Financial year name already exists.",
      409,
    );
  }

  /**
   * Date overlap
   *
   * Existing:
   * |-------------|
   *
   * New:
   *       |-------------|
   *
   * Overlap condition:
   * existing.start <= new.end
   * AND
   * existing.end >= new.start
   */
  const overlappingFinancialYear =
    await FinancialYear.exists({
      startDate: {
        $lte: data.endDate,
      },
      endDate: {
        $gte: data.startDate,
      },
    });

  if (overlappingFinancialYear) {
    throw new AppError(
      "Financial year overlaps an existing financial year.",
      400,
    );
  }

  /**
   * Create
   */
  const financialYear =
    await FinancialYear.create({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      remarks: data.remarks,

      status: "DRAFT",

      members: [],

      executiveCommittee: {
        president: null,
        vicePresident: null,
        secretary: null,
        jointSecretary: null,
        treasurer: null,
      },

      openingBalances: {
        bankBalance: 0,
        cashInHand: 0,
        excessCorpus: 0,
        investments: 0,
        otherLoans: 0,
      },
    });

  return financialYear.toObject();
}