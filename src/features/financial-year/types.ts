export type MemberLookup = {
  _id: string;

  memberCode: string;

  name: string;
};

export type FinancialYearMember = {
  member: MemberLookup;

  opening: {
    contribution: number;

    loan: number;

    specialLoan: number;

    specialLoanExpiry: Date | null;
  };
};

export type FinancialYearDetails = {
  _id: string;

  name: string;

  status:
  | "DRAFT"
  | "IN_PROGRESS"
  | "VALIDATED"
  | "APPROVED"
  | "CLOSED";

  startDate: Date;

  endDate: Date;

  remarks: string;

  members: FinancialYearMember[];

  executiveCommittee: {
    president: MemberLookup | null;

    vicePresident: MemberLookup | null;

    secretary: MemberLookup | null;

    jointSecretary: MemberLookup | null;

    treasurer: MemberLookup | null;
  };

  openingBalances: {
    bankBalance: number;

    cashInHand: number;

    excessCorpus: number;

    investments: number;

    otherLoans: number;
  };
};

export type ValidationItem = {
  label: string;

  valid: boolean;
};

export type ValidationResult = {
  valid: boolean;

  items: ValidationItem[];
};

export type FinancialYearSummary = {
  _id: string;

  name: string;

  status:
  | "DRAFT"
  | "IN_PROGRESS"
  | "VALIDATED"
  | "APPROVED"
  | "CLOSED";

  startDate: Date;

  endDate: Date;
};

export type ClosedFinancialYearLookup = {
  _id: string;

  name: string;

  startDate: string;

  endDate: string;

  closedAt: string | null;

  memberCount: number;

  bankBalance: number;
};

export type OpeningBalanceSourceFinancialYearLookup = ClosedFinancialYearLookup & {
  status: "CLOSED" | "VALIDATED" | "APPROVED";
};

export type CreateFinancialYearDraft = {
  name: string;

  startDate: string;

  endDate: string;

  remarks: string;
};