import { Types } from "mongoose";

export type PopulatedMember = {
  _id: Types.ObjectId;

  memberCode: string;

  name: string;
};

export type PopulatedFinancialYearMember = {
  memberId: PopulatedMember;

  opening: {
    contribution: number;

    loan: number;

    specialLoan: number;

    specialLoanExpiry: Date | null;
  };
};

export type PopulatedExecutiveCommittee = {
  president: PopulatedMember | null;

  vicePresident: PopulatedMember | null;

  secretary: PopulatedMember | null;

  jointSecretary: PopulatedMember | null;

  treasurer: PopulatedMember | null;
};