import { Types } from "mongoose";

import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";

import {
  UpdateFinancialYearInput,
  validateUpdateFinancialYear,
} from "../validation";

/**
 * Update Financial Year
 *
 * Business Rules
 * - Financial Year must exist
 * - Closed Financial Year is read-only
 * - Name must be unique
 * - Financial Year periods must not overlap
 * - Start date must be before end date
 */
export async function update(
  id: string,
  input: unknown,
) {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(
      "Invalid financial year id.",
      400,
    );
  }

  const data: UpdateFinancialYearInput =
    validateUpdateFinancialYear(input);

  const financialYear =
    await FinancialYear.findById(id);

  if (!financialYear) {
    throw new AppError(
      "Financial year not found.",
      404,
    );
  }

  if (financialYear.status === "CLOSED") {
    throw new AppError(
      "Closed financial years cannot be modified.",
      400,
    );
  }

  /**
   * Name uniqueness
   */
  if (
    data.name &&
    data.name !== financialYear.name
  ) {
    const existing =
      await FinancialYear.exists({
        _id: {
          $ne: financialYear._id,
        },
        name: data.name,
      });

    if (existing) {
      throw new AppError(
        "Financial year name already exists.",
        409,
      );
    }
  }

  /**
   * Validate overlap
   */
  const startDate =
    data.startDate ??
    financialYear.startDate;

  const endDate =
    data.endDate ??
    financialYear.endDate;

  const overlap =
    await FinancialYear.exists({
      _id: {
        $ne: financialYear._id,
      },
      startDate: {
        $lte: endDate,
      },
      endDate: {
        $gte: startDate,
      },
    });

  if (overlap) {
    throw new AppError(
      "Financial year overlaps an existing financial year.",
      400,
    );
  }

  /**
   * General
   */
  if (data.name !== undefined) {
    financialYear.name = data.name;
  }

  if (data.startDate !== undefined) {
    financialYear.startDate =
      data.startDate;
  }

  if (data.endDate !== undefined) {
    financialYear.endDate =
      data.endDate;
  }

  if (data.remarks !== undefined) {
    financialYear.remarks =
      data.remarks;
  }

  /**
   * Members
   */
  if (data.members !== undefined) {
    financialYear.members = data.members.map(
      (memberId) =>
        new Types.ObjectId(memberId),
    );
  }

  /**
   * Executive Committee
   */
  if (
    data.executiveCommittee !== undefined
  ) {
    const committee =
      data.executiveCommittee;

    financialYear.executiveCommittee = {
      president: committee.president
        ? new Types.ObjectId(
            committee.president,
          )
        : null,

      vicePresident:
        committee.vicePresident
          ? new Types.ObjectId(
              committee.vicePresident,
            )
          : null,

      secretary: committee.secretary
        ? new Types.ObjectId(
            committee.secretary,
          )
        : null,

      jointSecretary:
        committee.jointSecretary
          ? new Types.ObjectId(
              committee.jointSecretary,
            )
          : null,

      treasurer: committee.treasurer
        ? new Types.ObjectId(
            committee.treasurer,
          )
        : null,
    };
  }

  /**
   * Opening Balances
   */
  if (
    data.openingBalances !== undefined
  ) {
    financialYear.openingBalances = {
      ...financialYear.openingBalances,
      ...data.openingBalances,
    };
  }

  await financialYear.save();

  return financialYear.toObject();
}