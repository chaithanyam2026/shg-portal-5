export type FinancialYearMember = {
  memberId: {
    _id: string;
    memberCode: string;
    name: string;
  };

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

  status: "DRAFT" | "IN_PROGRESS" | "VALIDATED" | "APPROVED" | "CLOSED";

  startDate: Date;

  endDate: Date;

  remarks: string;

  members: FinancialYearMember[];

  executiveCommittee: {
    president: FinancialYearMember | null;
    vicePresident: FinancialYearMember | null;
    secretary: FinancialYearMember | null;
    jointSecretary: FinancialYearMember | null;
    treasurer: FinancialYearMember | null;
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

  status: "DRAFT" | "IN_PROGRESS" | "VALIDATED" | "APPROVED" | "CLOSED";

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

export type CreateFinancialYearDraft = {
  name: string;

  startDate: string;

  endDate: string;

  remarks: string;
};
