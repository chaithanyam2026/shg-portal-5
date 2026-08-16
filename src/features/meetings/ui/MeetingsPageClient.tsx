"use client";

import { useRouter } from "next/navigation";

import { Button, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

import Link from "next/link";

import PageHeader from "@/components/layout/PageHeader";
import type { FinancialYearSummary } from "@/features/financial-year/types";
import type { MeetingSummary } from "@/features/meetings/types";
import MeetingTable from "@/features/meetings/ui/MeetingTable";

const ALL_FINANCIAL_YEARS = "";

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

type Props = {
  meetings: MeetingSummary[];
  financialYears: FinancialYearSummary[];
  financialYearId: string;
};

export default function MeetingsPageClient({
  meetings,
  financialYears,
  financialYearId,
}: Props) {
  const router = useRouter();

  function handleFinancialYearChange(value: string) {
    const params = new URLSearchParams();

    if (value) {
      params.set("financialYearId", value);
    }

    const query = params.toString();
    router.push(query ? `/meetings?${query}` : "/meetings");
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

      <MeetingTable meetings={meetings} />
    </Stack>
  );
}
