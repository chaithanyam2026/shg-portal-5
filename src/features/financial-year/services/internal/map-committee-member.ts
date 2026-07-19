import type { FinancialYearMember } from "../../types";

import type { PopulatedMember } from "./types";

export function mapCommitteeMember(
  member: PopulatedMember | null,
): FinancialYearMember | null {
  if (!member) {
    return null;
  }

  return {
    memberId: {
      _id: member._id.toString(),

      memberCode: member.memberCode,

      name: member.name,
    },

    opening: {
      contribution: 0,

      loan: 0,

      specialLoan: 0,

      specialLoanExpiry: null,
    },
  };
}