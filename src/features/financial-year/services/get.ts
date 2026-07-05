import { Types } from "mongoose";

import FinancialYear from "@/models/FinancialYear";

export async function get(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid financial year id.");
  }

  const financialYear = await FinancialYear.findById(id).lean();

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  return financialYear;
}