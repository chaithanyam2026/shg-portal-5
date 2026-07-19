"use client";

import { Alert, Stack, Typography } from "@mui/material";

import type { FinancialYearLookup } from "@/features/financial-year/types";

import Link from "next/link";
import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { useLoanFilters } from "../hooks";

import { Box, Fab } from "@mui/material";

import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import { LOAN_STATUSES, LOAN_TYPES } from "../domain";

import type { LoanSummary } from "../types";

import LoanCard from "./LoanCard";

type Props = {
  loans: LoanSummary[];

  financialYears: FinancialYearLookup[];
};

export default function LoanList({ loans, financialYears }: Props) {
  // const [search, setSearch] =
  //   useState("");

  const [financialYearId, setFinancialYearId] = useState("");

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
    useLoanFilters(loans);

  if (filteredLoans.length === 0) {
    return <Alert severity="info">No loans found.</Alert>;
  }

  return (
    <Box
      sx={{
        position: "relative",
        pb: 10,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5">Loans</Typography>

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

        {filteredLoans.length === 0 ? (
          <Alert severity="info">No loans found.</Alert>
        ) : (
          <Stack spacing={2}>
            {filteredLoans.map((loan) => (
              <LoanCard key={loan._id} loan={loan} />
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
