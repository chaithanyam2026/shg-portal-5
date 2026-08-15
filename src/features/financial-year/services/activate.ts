import { Types } from "mongoose";

import { validateFinancialYear } from "@/features/financial-year/services/validate";
import {
  closeFinancialYearLoans,
  countActiveLoansOutsideFinancialYear,
  createOpeningLoans,
} from "@/features/loans/services";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";
import { assertFinancialYearActivationAllowed } from "./internal/assert-financial-year-lifecycle";
import { mapFinancialYearDetails } from "./internal";
import { populateFinancialYear } from "./internal/populate-financial-year";

export async function activate(id: string) {
  await connectMongo();

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  const financialYear = await FinancialYear.findById(id);

  if (!financialYear) {
    throw new AppError("Financial year not found.", 404);
  }

  // const testStatus: string = financialYear.status;

  if (financialYear.status !== "DRAFT") {
    throw new AppError("Only draft financial years can be activated.", 400);
  }

  const validation = validateFinancialYear(financialYear.toObject());

  if (!validation.valid) {
    throw new AppError("Financial year is not ready to start.", 400);
  }

  await assertFinancialYearActivationAllowed(financialYear._id.toString());

  if (financialYear.sourceFinancialYearId) {
    await closeFinancialYearLoans(financialYear.sourceFinancialYearId.toString());
  }

  const remainingActiveLoans = await countActiveLoansOutsideFinancialYear(
    financialYear._id.toString(),
  );

  if (remainingActiveLoans > 0) {
    throw new AppError(
      `${remainingActiveLoans} active loan(s) exist outside this financial year. Close them before starting.`,
      400,
    );
  }

  financialYear.status = "IN_PROGRESS";
  //financialYear.status = "ACTIVE";

  await createOpeningLoans({
    financialYearId: financialYear._id.toString(),
  });

  await financialYear.save();

  /* return financialYear.toObject({
    flattenObjectIds: true,
  }); */




  const populatedFinancialYear = await populateFinancialYear(financialYear);

  return mapFinancialYearDetails(populatedFinancialYear);
}
