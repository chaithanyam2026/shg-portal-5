import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";

import FinancialYear from "@/models/FinancialYear";
import "@/models/Member";

import type { FinancialYearDetails } from "../types";
import { mapFinancialYearDetails } from "./internal";

type PopulatedMember = {
  _id: Types.ObjectId;
  memberCode: string;
  name: string;
};

type PopulatedFinancialYear = Omit<
  Awaited<ReturnType<typeof FinancialYear.findById>> extends infer T
  ? T
  : never,
  never
>;

export async function get(
  id: string,
): Promise<
  FinancialYearDetails & {
    openingMemberTotals: {
      contribution: number;
      loan: number;
      specialLoan: number;
    };
  }
> {
  await connectMongo();

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  const result = await FinancialYear.findById(id)
    .populate({
      path: "members.memberId",
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
    })
    .lean()
    .exec();

  if (!result) {
    throw new AppError("Financial year not found.", 404);
  }

  const financialYear = result as typeof result & {
    members: Array<
      Omit<(typeof result.members)[number], "memberId"> & {
        memberId: PopulatedMember;
      }
    >;

    executiveCommittee: {
      president: PopulatedMember | null;
      vicePresident: PopulatedMember | null;
      secretary: PopulatedMember | null;
      jointSecretary: PopulatedMember | null;
      treasurer: PopulatedMember | null;
    };
  };

  const openingMemberTotals = financialYear.members.reduce(
    (totals, member) => {
      totals.contribution += member.opening?.contribution ?? 0;
      totals.loan += member.opening?.loan ?? 0;
      totals.specialLoan += member.opening?.specialLoan ?? 0;

      return totals;
    },
    {
      contribution: 0,
      loan: 0,
      specialLoan: 0,
    },
  );

  /* return {
    _id: financialYear._id.toString(),

    name: financialYear.name,

    startDate: financialYear.startDate,

    endDate: financialYear.endDate,

    remarks: financialYear.remarks,

    status: financialYear.status,

    sourceFinancialYearId:
      financialYear.sourceFinancialYearId?.toString() ?? null,

    members: financialYear.members.map((member) => ({
      ...member,

      memberId: {
        _id: member.memberId._id.toString(),
        memberCode: member.memberId.memberCode,
        name: member.memberId.name,
      },
    })),

    executiveCommittee: {
      president: financialYear.executiveCommittee.president && {
        _id: financialYear.executiveCommittee.president._id.toString(),
        memberCode: financialYear.executiveCommittee.president.memberCode,
        name: financialYear.executiveCommittee.president.name,
      },

      vicePresident: financialYear.executiveCommittee.vicePresident && {
        _id: financialYear.executiveCommittee.vicePresident._id.toString(),
        memberCode: financialYear.executiveCommittee.vicePresident.memberCode,
        name: financialYear.executiveCommittee.vicePresident.name,
      },

      secretary: financialYear.executiveCommittee.secretary && {
        _id: financialYear.executiveCommittee.secretary._id.toString(),
        memberCode: financialYear.executiveCommittee.secretary.memberCode,
        name: financialYear.executiveCommittee.secretary.name,
      },

      jointSecretary: financialYear.executiveCommittee.jointSecretary && {
        _id: financialYear.executiveCommittee.jointSecretary._id.toString(),
        memberCode:
          financialYear.executiveCommittee.jointSecretary.memberCode,
        name: financialYear.executiveCommittee.jointSecretary.name,
      },

      treasurer: financialYear.executiveCommittee.treasurer && {
        _id: financialYear.executiveCommittee.treasurer._id.toString(),
        memberCode: financialYear.executiveCommittee.treasurer.memberCode,
        name: financialYear.executiveCommittee.treasurer.name,
      },
    },

    openingBalances: financialYear.openingBalances,

    memberOpeningBalances: financialYear.memberOpeningBalances,

    closing: financialYear.closing,

    createdAt: financialYear.createdAt,

    updatedAt: financialYear.updatedAt,

    openingMemberTotals,
  }; */
  const details = mapFinancialYearDetails(
    financialYear,
  );

  return {
    ...details,

    openingMemberTotals,
  };
}