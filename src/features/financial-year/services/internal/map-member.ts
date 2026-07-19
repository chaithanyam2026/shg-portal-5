import type { FinancialYearMember } from "../../types";

import type { PopulatedFinancialYearMember } from "./types";

export function mapMember(
  member: PopulatedFinancialYearMember,
): FinancialYearMember {
  return {
    memberId: {
      _id: member.memberId._id.toString(),

      memberCode: member.memberId.memberCode,

      name: member.memberId.name,
    },

    opening: {
      contribution: member.opening.contribution,

      loan: member.opening.loan,

      specialLoan: member.opening.specialLoan,

      specialLoanExpiry: member.opening.specialLoanExpiry,
    },
  };
}