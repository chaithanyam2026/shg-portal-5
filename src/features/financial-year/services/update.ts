import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import FinancialYear from "@/models/FinancialYear";

import type { FinancialYearDocument } from "@/models/FinancialYear";
import { UpdateFinancialYearInput, validateUpdateFinancialYear } from "../validation";
import { assertFinancialYearEditable } from "./assert-editable";
import { mapFinancialYearDetails } from "./internal";

async function validateDateOverlap(
  financialYear: FinancialYearDocument,
  startDate: Date,
  endDate: Date,
) {
  const overlap = await FinancialYear.exists({
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
    throw new AppError("Financial year overlaps an existing financial year.", 400);
  }
}

function validateCommittee(
  memberIds: string[],
  committee?: UpdateFinancialYearInput["executiveCommittee"],
) {
  if (!committee) {
    return;
  }

  const memberSet = new Set(memberIds);

  const selectedMembers = Object.values(committee).filter(
    (memberId): memberId is string => !!memberId,
  );

  if (new Set(selectedMembers).size !== selectedMembers.length) {
    throw new AppError("Committee members must be unique.", 400);
  }

  for (const memberId of selectedMembers) {
    if (!memberSet.has(memberId)) {
      throw new AppError("Committee members must belong to the financial year.", 400);
    }
  }
}

function validateMembers(members?: UpdateFinancialYearInput["members"]) {
  if (!members) {
    return;
  }

  const ids = members.map((member) => member.memberId);
  if (new Set(ids).size !== ids.length) {
    throw new AppError("Duplicate members are not allowed.", 400);
  }

  for (const member of members) {
    if (member.openingContribution < 0) {
      throw new AppError("Opening contribution cannot be negative.", 400);
    }

    if (member.openingLoan < 0) {
      throw new AppError("Opening loan cannot be negative.", 400);
    }

    if (member.openingSpecialLoan < 0) {
      throw new AppError("Opening special loan cannot be negative.", 400);
    }

    if (member.openingSpecialLoan > 0 && !member.specialLoanExpiry) {
      throw new AppError("Special loan expiry is required.", 400);
    }
  }
}

function validateEditable(financialYear: FinancialYearDocument) {
  if (financialYear.status === "APPROVED" || financialYear.status === "CLOSED") {
    throw new AppError("Financial year cannot be modified.", 400);
  }
}

function validateOpeningBalances(openingBalances?: {
  bankBalance: number;
  cashInHand: number;
  excessCorpus: number;
  investments: number;
  otherLoans: number;
}) {
  if (!openingBalances) {
    return;
  }

  for (const value of Object.values(openingBalances)) {
    if (value < 0) {
      throw new AppError("Opening balances cannot be negative.", 400);
    }
  }
}

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
export async function update(id: string, input: unknown) {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  await connectMongo();

  const data: UpdateFinancialYearInput = validateUpdateFinancialYear(input);

  const financialYear = await FinancialYear.findById(id);

  if (!financialYear) {
    throw new AppError("Financial year not found.", 404);
  }

  /**
   * Name uniqueness
   */
  if (data.name && data.name !== financialYear.name) {
    const existing = await FinancialYear.exists({
      _id: {
        $ne: financialYear._id,
      },
      name: data.name,
    });

    if (existing) {
      throw new AppError("Financial year name already exists.", 409);
    }
  }

  /**
   * Validate overlap
   */
  const startDate = data.startDate ?? financialYear.startDate;

  const endDate = data.endDate ?? financialYear.endDate;

  validateEditable(financialYear);
  await validateDateOverlap(financialYear, startDate, endDate);
  validateMembers(data.members);
  validateCommittee(
    (data.members ?? financialYear.members).map(
      (
        member:
          UpdateFinancialYearInput["members"][number] | FinancialYearDocument["members"][number],
      ) =>
        (member.memberId ?? member)._id
          ? (member.memberId ?? member)._id.toString()
          : (member.memberId ?? member).toString(),
    ),
    data.executiveCommittee,
  );
  validateOpeningBalances(data.openingBalances);

  /**
   * General
   */
  if (data.name !== undefined) {
    financialYear.name = data.name;
  }

  if (data.startDate !== undefined) {
    financialYear.startDate = data.startDate;
  }

  if (data.endDate !== undefined) {
    financialYear.endDate = data.endDate;
  }

  if (data.remarks !== undefined) {
    financialYear.remarks = data.remarks;
  }

  /**
   * Members
   */
  if (data.members !== undefined) {
    financialYear.members = data.members.map((member) => ({
      memberId: new Types.ObjectId(member.memberId),

      opening: {
        contribution: member.openingContribution,

        loan: member.openingLoan,

        specialLoan: member.openingSpecialLoan,

        specialLoanExpiry: member.specialLoanExpiry,
      },
    }));
  }

  /**
   * Executive Committee
   */
  if (data.executiveCommittee !== undefined) {
    const committee = data.executiveCommittee;

    financialYear.executiveCommittee = {
      president: committee.president ? new Types.ObjectId(committee.president) : null,

      vicePresident: committee.vicePresident ? new Types.ObjectId(committee.vicePresident) : null,

      secretary: committee.secretary ? new Types.ObjectId(committee.secretary) : null,

      jointSecretary: committee.jointSecretary
        ? new Types.ObjectId(committee.jointSecretary)
        : null,

      treasurer: committee.treasurer ? new Types.ObjectId(committee.treasurer) : null,
    };
  }

  /**
   * Opening Balances
   */
  if (data.openingBalances !== undefined) {
    financialYear.openingBalances = {
      ...financialYear.openingBalances,
      ...data.openingBalances,
    };
  }

  await assertFinancialYearEditable(financialYearId);

  await financialYear.save();

  //return financialYear.toObject();
  return mapFinancialYearDetails(financialYear);
}
