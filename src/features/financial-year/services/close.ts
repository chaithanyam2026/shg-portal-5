import mongoose from "mongoose";

import connectMongo from "@/lib/db/mongodb";

import FinancialYear from "@/models/FinancialYear";

import type { ClosingValidation, FinancialYearClose } from "../domain";

import {
  buildClosingBalances,
  buildMemberClosingBalances,
  validateFinancialYearClose,
} from "./internal";

export class FinancialYearCloseError extends Error {
  readonly validation: ClosingValidation;

  constructor(message: string, validation: ClosingValidation) {
    super(message);
    this.name = "FinancialYearCloseError";
    this.validation = validation;
    Object.setPrototypeOf(this, FinancialYearCloseError.prototype);
  }
}

type PopulatedMemberRef = {
  _id: mongoose.Types.ObjectId;
  memberCode: string;
  name: string;
};

function isPopulatedMemberRef(value: unknown): value is PopulatedMemberRef {
  return (
    typeof value === "object" &&
    value !== null &&
    "_id" in value &&
    "memberCode" in value &&
    "name" in value
  );
}

export async function closeFinancialYear(
  financialYearId: string,
  closedBy: string,
): Promise<FinancialYearClose> {
  await connectMongo();

  const financialYear = await FinancialYear.findById(financialYearId).populate({
    path: "members.memberId",
    select: "memberCode name",
  });

  if (!financialYear) {
    throw new Error("Financial year not found.");
  }

  if (financialYear.status !== "APPROVED") {
    throw new Error("Only APPROVED financial years can be closed.");
  }

  const validation = await validateFinancialYearClose(financialYearId);

  if (!validation.valid) {
    const failedChecks = validation.items
      .filter((item) => !item.valid)
      .map((item) => item.title)
      .join(", ");

    throw new FinancialYearCloseError(
      failedChecks
        ? `Financial year cannot be closed. Failed checks: ${failedChecks}.`
        : "Financial year cannot be closed.",
      validation,
    );
  }

  const openingBalances = financialYear.openingBalances ?? {
    bankBalance: 0,
    cashInHand: 0,
    excessCorpus: 0,
    investments: 0,
    otherLoans: 0,
  };

  const members = buildMemberClosingBalances(
    financialYear.members.map((member) => {
      if (!isPopulatedMemberRef(member.memberId)) {
        throw new Error("Financial year members are not populated.");
      }

      return {
        memberId: member.memberId._id,
        memberCode: member.memberId.memberCode,
        memberName: member.memberId.name,
        savingsBalance: member.opening.contribution,
        loanOutstanding: member.opening.loan,
        specialLoanOutstanding: member.opening.specialLoan,
        attendanceFineOutstanding: 0,
        loanFineOutstanding: 0,
      };
    }),
  );

  const summary = buildClosingBalances({
    bankBalance: openingBalances.bankBalance,
    cashInHand: openingBalances.cashInHand,
    excessCorpus: openingBalances.excessCorpus,
    investments: openingBalances.investments,
    memberBalances: members,
  });

  const closedAt = new Date();

  financialYear.status = "CLOSED";

  financialYear.closing = {
    closedAt,
    closedBy: new mongoose.Types.ObjectId(closedBy),
    summary,
    members,
  };

  await financialYear.save();

  const { revalidateFinancialYearWrites } = await import("@/lib/cache");
  revalidateFinancialYearWrites();

  const responseSummary = {
    ...summary,
    savingsBalance: members.reduce((total, member) => total + member.savingsBalance, 0),
    loanOutstanding: members.reduce((total, member) => total + member.loanOutstanding, 0),
    specialLoanOutstanding: members.reduce(
      (total, member) => total + member.specialLoanOutstanding,
      0,
    ),
    attendanceFineOutstanding: members.reduce(
      (total, member) => total + member.attendanceFineOutstanding,
      0,
    ),
    loanFineOutstanding: members.reduce(
      (total, member) => total + member.loanFineOutstanding,
      0,
    ),
  };

  return {
    financialYearId: financialYear._id.toString(),

    financialYearName: financialYear.name,

    closedAt: closedAt.toISOString(),

    summary: responseSummary,

    members,

    validation,
  };
}
