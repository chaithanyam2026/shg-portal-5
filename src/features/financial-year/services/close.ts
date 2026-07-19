import mongoose from "mongoose";

import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import type { FinancialYearClose } from "../domain";

import {
  buildClosingBalances,
  buildMemberClosingBalances,
  mapFinancialYearDetails,
  validateFinancialYearClose,
} from "./internal";

export async function closeFinancialYear(
  financialYearId: string,
  closedBy: string,
): Promise<FinancialYearClose> {
  await connectMongo();

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const financialYear = await FinancialYear.findById(financialYearId).session(session);

    if (!financialYear) {
      throw new Error("Financial year not found.");
    }

    if (financialYear.status !== "APPROVED") {
      throw new Error("Only APPROVED financial years can be closed.");
    }

    const validation = await validateFinancialYearClose(financialYearId);

    if (!validation.valid) {
      throw new Error("Financial year cannot be closed.");
    }

    const summary = await buildClosingBalances(financialYearId);

    const members = await buildMemberClosingBalances(financialYearId);

    financialYear.status = "CLOSED";

    financialYear.closing = {
      closedAt: new Date(),
      closedBy: new mongoose.Types.ObjectId(closedBy),
      summary,
      members,
    };

    await financialYear.save({
      session,
    });

    await session.commitTransaction();

    const closedAt = new Date();

    financialYear.closing = {
      closedAt,
      closedBy: new mongoose.Types.ObjectId(closedBy),
      summary,
      members,
    };

    /* return {
      financialYearId: financialYear._id.toString(),

      financialYearName: financialYear.name,

     closedAt: closedAt.toISOString(),

      summary,

      members,

      validation,
    }; */
    return mapFinancialYearDetails(financialYear);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
