"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import AddIcon from "@mui/icons-material/Add";

import { Box, Fab, Stack } from "@mui/material";

import type { LoanSummary } from "../types";

import LoanFilters from "./LoanFilters";
import LoanList from "./LoanList";

type FinancialYearLookup = {
  _id: string;

  name: string;
};

type Props = {
  loans: LoanSummary[];

  financialYears: FinancialYearLookup[];
};

export default function LoansPage({ loans, financialYears }: Props) {
  const [search, setSearch] = useState("");

  const [financialYearId, setFinancialYearId] = useState("");

  const [status, setStatus] = useState("");

  const router = useRouter();

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        search.length === 0 ||
        loan.loanNumber.toLowerCase().includes(search.toLowerCase()) ||
        loan.memberName.toLowerCase().includes(search.toLowerCase()) ||
        loan.memberCode.toLowerCase().includes(search.toLowerCase());

      const matchesFinancialYear =
        financialYearId.length === 0 || loan.financialYearId === financialYearId;

      const matchesStatus = status.length === 0 || loan.status === status;

      return matchesSearch && matchesFinancialYear && matchesStatus;
    });
  }, [loans, search, financialYearId, status]);

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          pb: 10,
        }}
      >
        <Stack spacing={3}>
          <LoanFilters
            search={search}
            financialYearId={financialYearId}
            status={status}
            financialYears={financialYears}
            onSearchChange={setSearch}
            onFinancialYearChange={setFinancialYearId}
            onStatusChange={setStatus}
          />

          <LoanList loans={filteredLoans} financialYears={financialYears} />
        </Stack>

        <Fab
          color="primary"
          aria-label="Create Loan"
          onClick={() => router.push("/loans/new")}
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
}
