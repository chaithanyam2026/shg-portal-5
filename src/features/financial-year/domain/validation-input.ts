export type FinancialYearValidationInput = {
  name: string;

  startDate: Date;

  endDate: Date;

  members: unknown[];

  executiveCommittee: {
    president: unknown;
    secretary: unknown;
    treasurer: unknown;
  };
};