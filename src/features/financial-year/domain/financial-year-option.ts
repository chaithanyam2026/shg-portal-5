export type FinancialYearOption = {
  id: string;

  name: string;

  status:
    | "DRAFT"
    | "IN_PROGRESS"
    | "VALIDATED"
    | "APPROVED"
    | "CLOSED";
};