import type {
  LoanStatus,
  LoanType,
} from "../domain";

/**
 * Loan filter values.
 */
export type LoanFilters = {
  search: string;

  financialYearId: string;

  loanType: LoanType | "";

  status: LoanStatus | "";
};

/**
 * Hook state returned by
 * useLoanFilters().
 */
export type LoanFilterState = {
  filters: LoanFilters;

  setSearch(
    value: string,
  ): void;

  setFinancialYear(
    value: string,
  ): void;

  setLoanType(
    value: LoanType | "",
  ): void;

  setStatus(
    value: LoanStatus | "",
  ): void;
};