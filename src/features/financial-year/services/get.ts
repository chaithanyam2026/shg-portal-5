import connectMongo from "@/lib/db/mongodb";
import FinancialYear from "@/models/FinancialYear";
import { AppError } from "@/lib/errors";
import { Types } from "mongoose";
import "@/models/Member";

export async function get(id: string) {
  await connectMongo();

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid financial year id.", 400);
  }

  const financialYear = await FinancialYear.findById(id)
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

  if (!financialYear) {
    throw new AppError("Financial year not found.", 404);
  }

  const openingMemberTotals =
  financialYear.members.reduce(
    (totals, member) => {
      totals.contribution +=
        member.opening?.contribution ??
        0;

      totals.loan +=
        member.opening?.loan ??
        0;

      totals.specialLoan +=
        member.opening?.specialLoan ??
        0;

      return totals;
    },
    {
      contribution: 0,
      loan: 0,
      specialLoan: 0,
    },
  );

  return {
  ...financialYear,

  openingMemberTotals,
};
}