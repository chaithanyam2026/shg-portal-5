"use client";

import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";

type FinancialYearLookup = {
  _id: string;

  name: string;
};

type Props = {
  search: string;

  financialYearId: string;

  status: string;

  financialYears: FinancialYearLookup[];

  onSearchChange: (value: string) => void;

  onFinancialYearChange: (value: string) => void;

  onStatusChange: (value: string) => void;
};

export default function LoanFilters({
  search,
  financialYearId,
  status,
  financialYears,
  onSearchChange,
  onFinancialYearChange,
  onStatusChange,
}: Props) {
  return (
    <Stack spacing={2} mb={3}>
      <TextField
        fullWidth
        label="Search Loans"
        placeholder="Loan No., Member Code or Member Name"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <FormControl fullWidth>
        <InputLabel>Financial Year</InputLabel>

        <Select
          label="Financial Year"
          value={financialYearId}
          onChange={(event) => onFinancialYearChange(event.target.value)}
        >
          <MenuItem value="">All Financial Years</MenuItem>

          {financialYears.map((financialYear) => (
            <MenuItem key={financialYear._id} value={financialYear._id}>
              {financialYear.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>

        <Select
          label="Status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <MenuItem value="">All Statuses</MenuItem>

          <MenuItem value="ACTIVE">Active</MenuItem>

          <MenuItem value="CLOSED">Closed</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
