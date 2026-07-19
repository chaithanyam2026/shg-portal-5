import { Types } from "mongoose";

import { validateFinancialYear } from "@/features/financial-year/services/validate";
import { createOpeningLoans } from "@/features/loans/services";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";
import { mapFinancialYearDetails } from "./internal";
import { populateFinancialYear } from "./internal/populate-financial-year";

export async function activate(id: string) {
  await connectMongo();

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  const financialYear = await FinancialYear.findById(id)
    .populate({
      path: "members",
      select: "memberCode name",
    })
    .populate({
      path: "executiveCommittee.president",
      select: "memberCode name",
    })
    .populate({
      path: "executiveCommittee.vicePresident",
      select: "memberCode name",
    })
    .populate({
      path: "executiveCommittee.secretary",
      select: "memberCode name",
    })
    .populate({
      path: "executiveCommittee.jointSecretary",
      select: "memberCode name",
    })
    .populate({
      path: "executiveCommittee.treasurer",
      select: "memberCode name",
    });

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

  const activeFinancialYear = await FinancialYear.findOne({
    _id: {
      $ne: financialYear._id,
    },
    status: "IN_PROGRESS",
  })
    .select("_id name")
    .lean();

  if (activeFinancialYear) {
    throw new AppError("Another financial year is already active.", 400);
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




  await populateFinancialYear(financialYear);

  return mapFinancialYearDetails(financialYear);
}
