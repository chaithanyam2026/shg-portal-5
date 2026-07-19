"use client";

import { useState } from "react";
import type { LoanSummaryResult } from "../domain/loan-summary";

import { Box, Stack, Tab, Tabs } from "@mui/material";

import type { LoanDetails } from "../types";

import PageHeader from "@/components/layout/PageHeader";
import type { LoanPassbook } from "../domain/loan-passbook";
import GeneralTab from "./tabs/GeneralTab";
import PassbookTab from "./tabs/PassbookTab";
import SummaryTab from "./tabs/SummaryTab";

type Props = {
  loan: LoanDetails;
  summary: LoanSummaryResult;
  passbook: LoanPassbook;
};

export default function LoanTabs({ loan, summary, passbook }: Props) {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Stack
        spacing={3}
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <PageHeader
          title="Loans"
          // showBack={false}
        />
      </Stack>
      <Tabs value={tab} onChange={(_event, value: number) => setTab(value)} variant="fullWidth">
        <Tab label="General" />

        <Tab label="Summary" />

        <Tab label="Passbook" />
      </Tabs>

      <Box
        sx={{
          mt: 3,
        }}
      >
        {tab === 0 && <GeneralTab loan={loan} />}

        {tab === 1 && <SummaryTab loan={loan} summary={summary} />}

        {tab === 2 && <PassbookTab passbook={passbook} />}
      </Box>
    </Box>
  );
}
