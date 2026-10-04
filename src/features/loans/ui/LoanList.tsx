"use client";

import { Alert, Stack } from "@mui/material";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { useLoanFilters } from "../hooks";

import { Box, Fab } from "@mui/material";

import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import { LOAN_STATUSES, LOAN_TYPES } from "../domain";

import type { LoanSummary } from "../types";

import LoanCard from "./LoanCard";

type FinancialYearLookup = {
  _id: string;
  name: string;
};

type Props = {
  loans: LoanSummary[];

  financialYears: FinancialYearLookup[];

  ownLoansOnly?: boolean;

  initialFinancialYearId?: string;
};

export default function LoanList({
  loans: initialLoans,
  financialYears,
  ownLoansOnly = false,
  initialFinancialYearId = "",
}: Props) {
  const [loans, setLoans] = useState(initialLoans);
  const [yearLoading, setYearLoading] = useState(false);
  const [yearError, setYearError] = useState("");
  const skipYearFetch = useRef(true);

  // const [loanType, setLoanType] =
  //   useState("");

  // const [status, setStatus] =
  //   useState("");

  /* const filteredLoans =
    useMemo(() => {
      return loans.filter(
        (loan) => {
          const matchesSearch =
            search === "" ||
            loan.loanNumber
              .toLowerCase()
              .includes(
                search.toLowerCase(),
              ) ||
            loan.memberName
              .toLowerCase()
              .includes(
                search.toLowerCase(),
              ) ||
            loan.memberCode
              .toLowerCase()
              .includes(
                search.toLowerCase(),
              );

          const matchesYear =
            financialYearId === "" ||
            loan.financialYearId ===
            financialYearId;

          const matchesLoanType =
            loanType === "" ||
            loan.loanType ===
            loanType;

          const matchesStatus =
            status === "" ||
            loan.status ===
            status;

          return (
            matchesSearch &&
            matchesYear &&
            matchesLoanType &&
            matchesStatus
          );
        },
      );
    }, [
      loans,
      search,
      financialYearId,
      loanType,
      status,
    ]); */
  const { filters, filteredLoans, setSearch, setFinancialYear, setLoanType, setStatus } =
    useLoanFilters(loans, { financialYearId: initialFinancialYearId });

  useEffect(() => {
    setLoans(initialLoans);
  }, [initialLoans]);

  useEffect(() => {
    if (skipYearFetch.current) {
      skipYearFetch.current = false;
      return;
    }

    const financialYearId = filters.financialYearId;
    let cancelled = false;

    async function loadLoansForYear() {
      setYearLoading(true);
      setYearError("");

      try {
        const params = new URLSearchParams();

        if (financialYearId) {
          params.set("financialYearId", financialYearId);
        }

        const query = params.toString();
        const response = await fetch(query ? `/api/loans?${query}` : "/api/loans");
        const result = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(
            result.message ?? "Unable to load loans for the selected financial year.",
          );
        }

        if (!cancelled) {
          setLoans(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        if (!cancelled) {
          setYearError(error instanceof Error ? error.message : "Unable to load loans.");
        }
      } finally {
        if (!cancelled) {
          setYearLoading(false);
        }
      }
    }

    void loadLoansForYear();

    return () => {
      cancelled = true;
    };
  }, [filters.financialYearId]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.financialYearId !== "" ||
    filters.loanType !== "" ||
    filters.status !== "";

  return (
    <Box
      sx={{
        position: "relative",
        pb: 10,
      }}
    >
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Search"
          placeholder="Loan number, member..."
          value={filters.search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
        >
          <FormControl fullWidth>
            <InputLabel>Financial Year</InputLabel>

            <Select
              label="Financial Year"
              value={filters.financialYearId}
              disabled={yearLoading}
              onChange={(event) => setFinancialYear(event.target.value)}
            >
              <MenuItem value="">All</MenuItem>

              {financialYears.map((year) => (
                <MenuItem key={year._id} value={year._id}>
                  {year.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Loan Type</InputLabel>

            <Select
              label="Loan Type"
              value={filters.loanType}
              onChange={(event) => setLoanType(event.target.value as typeof filters.loanType)}
            >
              <MenuItem value="">All</MenuItem>

              {LOAN_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>

            <Select
              label="Status"
              /* onChange={(event) =>
  setStatus(
    event.target.value,
  ) */

              onChange={(event) => setStatus(event.target.value as typeof filters.status)}
            >
              <MenuItem value="">All</MenuItem>

              {LOAN_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {yearError && <Alert severity="error">{yearError}</Alert>}

        {yearLoading ? (
          <Alert severity="info">Loading loans...</Alert>
        ) : filteredLoans.length === 0 ? (
          <Alert severity="info">
            {loans.length === 0
              ? ownLoansOnly
                ? "You do not have any loans."
                : filters.financialYearId
                  ? "No loans found for this financial year."
                  : "No loans have been created yet."
              : hasActiveFilters
                ? "No loans match the current filters. Try adjusting your search or filters."
                : "No loans found."}
          </Alert>
        ) : (
          <Stack spacing={2}>
            {filteredLoans.map((loan) => (
              <LoanCard key={loan._id} loan={loan} canViewDetails />
            ))}
          </Stack>
        )}
      </Stack>

      <Fab
        color="primary"
        component={Link}
        href="/loans/new"
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
        }}
        aria-label="Create Loan"
      >
        <AddIcon />
      </Fab>
    </Box>
  );
  /* return (
    <Stack spacing={2}>
      <Typography variant="h5">
        Loans
      </Typography>

      <TextField
        fullWidth
        label="Search"
        placeholder="Loan number, member..."
        value={search}
        onChange={(event) =>
          setSearch(
            event.target.value,
          )
        }
      />

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
      >
        <FormControl fullWidth>
          <InputLabel>
            Financial Year
          </InputLabel>

          <Select
            label="Financial Year"
            value={
              financialYearId
            }
            onChange={(event) =>
              setFinancialYearId(
                event.target.value,
              )
            }
          >
            <MenuItem value="">
              All
            </MenuItem>

            {financialYears.map(
              (year) => (
                <MenuItem
                  key={year._id}
                  value={year._id}
                >
                  {year.name}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>
            Loan Type
          </InputLabel>

          <Select
            label="Loan Type"
            value={loanType}
            onChange={(event) =>
              setLoanType(
                event.target.value,
              )
            }
          >
            <MenuItem value="">
              All
            </MenuItem>

            {LOAN_TYPES.map(
              (type) => (
                <MenuItem
                  key={type}
                  value={type}
                >
                  {type}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>
            Status
          </InputLabel>

          <Select
            label="Status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value,
              )
            }
          >
            <MenuItem value="">
              All
            </MenuItem>

            {LOAN_STATUSES.map(
              (value) => (
                <MenuItem
                  key={value}
                  value={value}
                >
                  {value}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>
      </Stack>

      {filteredLoans.map(
        (loan) => (
          <LoanCard
            key={loan._id}
            loan={loan}
          />
        ),
      )}
    </Stack>
  ); */
}
