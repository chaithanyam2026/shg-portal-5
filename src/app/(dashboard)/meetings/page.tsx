"use client";

import { useEffect, useState } from "react";

import { Alert, Box, Button, CircularProgress, Stack } from "@mui/material";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import Link from "next/link";

import PageHeader from "@/components/layout/PageHeader";
import type { FinancialYearSummary } from "@/features/financial-year/types";
import type { MeetingListResult, MeetingSummary } from "@/features/meetings/types";
import MeetingTable from "@/features/meetings/ui/MeetingTable";

const ALL_FINANCIAL_YEARS = "";

function getDefaultFinancialYearId(financialYears: FinancialYearSummary[]): string {
  const activeFinancialYear = financialYears.find(
    (financialYear) => financialYear.status === "IN_PROGRESS",
  );

  return activeFinancialYear?._id ?? ALL_FINANCIAL_YEARS;
}

function formatFinancialYearLabel(financialYear: FinancialYearSummary) {
  switch (financialYear.status) {
    case "IN_PROGRESS":
      return `${financialYear.name} (In Progress)`;

    case "CLOSED":
      return `${financialYear.name} (Closed)`;

    case "APPROVED":
      return `${financialYear.name} (Approved)`;

    case "VALIDATED":
      return `${financialYear.name} (Validated)`;

    case "DRAFT":
      return `${financialYear.name} (Draft)`;

    default:
      return financialYear.name;
  }
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingSummary[]>([]);

  const [financialYears, setFinancialYears] = useState<FinancialYearSummary[]>([]);

  const [financialYearId, setFinancialYearId] = useState(ALL_FINANCIAL_YEARS);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadMeetings(selectedFinancialYearId: string) {
    try {
      setLoading(true);
      setError("");

      const pageSize = 100;
      let page = 1;
      let allMeetings: MeetingSummary[] = [];
      let total = 0;

      do {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });

        if (selectedFinancialYearId) {
          params.set("financialYearId", selectedFinancialYearId);
        }

        const response = await fetch(`/api/meetings?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to load meetings.");
        }

        const result: MeetingListResult = await response.json();

        allMeetings = allMeetings.concat(result.items);
        total = result.total;
        page += 1;
      } while (allMeetings.length < total);

      setMeetings(allMeetings);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load meetings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        setError("");

        const financialYearsResponse = await fetch("/api/financial-years");

        if (!financialYearsResponse.ok) {
          throw new Error("Failed to load financial years.");
        }

        const financialYearItems: FinancialYearSummary[] =
          await financialYearsResponse.json();

        setFinancialYears(financialYearItems);

        const defaultFinancialYearId = getDefaultFinancialYearId(financialYearItems);

        setFinancialYearId(defaultFinancialYearId);

        await loadMeetings(defaultFinancialYearId);
      } catch (initError) {
        setError(initError instanceof Error ? initError.message : "Failed to load meetings.");
        setLoading(false);
      }
    }

    void initialize();
  }, []);

  function handleFinancialYearChange(value: string) {
    setFinancialYearId(value);
    void loadMeetings(value);
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Meetings" showBack={false}>
        <Button component={Link} href="/meetings/new" variant="contained">
          Create Meeting
        </Button>
      </PageHeader>

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
          justifyContent: "space-between",
        }}
      >
        <FormControl
          size="small"
          sx={{
            minWidth: 280,
          }}
        >
          <InputLabel>Financial Year</InputLabel>

          <Select
            label="Financial Year"
            value={financialYearId}
            onChange={(event) => handleFinancialYearChange(event.target.value)}
          >
            <MenuItem value={ALL_FINANCIAL_YEARS}>All</MenuItem>

            {financialYears.map((financialYear) => (
              <MenuItem key={financialYear._id} value={financialYear._id}>
                {formatFinancialYearLabel(financialYear)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <MeetingTable meetings={meetings} />
      )}
    </Stack>
  );
}
