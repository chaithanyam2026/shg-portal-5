"use client";

import { useMemo, useState } from "react";

import type { LoanSummary } from "../types";

import type { LoanFilterState, LoanFilters } from "../types/loan-filters";

/**
 * Loan filtering hook.
 */
export function useLoanFilters(loans: LoanSummary[]): LoanFilterState & {
  filteredLoans: LoanSummary[];
} {
  const [filters, setFilters] = useState<LoanFilters>({
    search: "",

    financialYearId: "",

    loanType: "",

    status: "",
  });

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        filters.search === "" ||
        loan.loanNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        loan.memberName.toLowerCase().includes(filters.search.toLowerCase()) ||
        loan.memberCode.toLowerCase().includes(filters.search.toLowerCase());

      const matchesYear =
        filters.financialYearId === "" || loan.financialYearId === filters.financialYearId;

      const matchesLoanType = filters.loanType === "" || loan.loanType === filters.loanType;

      const matchesStatus = filters.status === "" || loan.status === filters.status;

      return matchesSearch && matchesYear && matchesLoanType && matchesStatus;
    });
  }, [loans, filters]);

  return {
    filters,

    filteredLoans,

    setSearch(search) {
      setFilters((previous) => ({
        ...previous,
        search,
      }));
    },

    setFinancialYear(financialYearId) {
      setFilters((previous) => ({
        ...previous,
        financialYearId,
      }));
    },

    setLoanType(loanType) {
      setFilters((previous) => ({
        ...previous,
        loanType,
      }));
    },

    setStatus(status) {
      setFilters((previous) => ({
        ...previous,
        status,
      }));
    },
  };
}
