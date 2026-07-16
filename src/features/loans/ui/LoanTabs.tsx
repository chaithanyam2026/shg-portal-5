"use client";

import { useState } from "react";

import {
  Box,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";

import type {
  LoanDetails,
} from "../types";

import GeneralTab from "./tabs/GeneralTab";
import PassbookTab from "./tabs/PassbookTab";
import SummaryTab from "./tabs/SummaryTab";
import type { LoanPassbook } from "../domain/loan-passbook";
import PageHeader from "@/components/layout/PageHeader";


type Props = {
  loan: LoanDetails;
   passbook: LoanPassbook;
};

export default function LoanTabs({
  loan,
  passbook
}: Props) {
  const [tab, setTab] =
    useState(0);

  return (
    <Box>
        <Stack
                  spacing={3}
                  alignItems="center"
                  textAlign="center"
                >
                  <PageHeader
                    title="Loans"
                    // showBack={false}
                  />
                  </Stack>
      <Tabs
        value={tab}
        onChange={(
          _event,
          value: number,
        ) => setTab(value)}
        variant="fullWidth"
      >
        <Tab
          label="General"
        />

        <Tab
          label="Summary"
        />

        <Tab
          label="Passbook"
        />
      </Tabs>

      <Box
        sx={{
          mt: 3,
        }}
      >
        {tab === 0 && (
          <GeneralTab
            loan={loan}
          />
        )}

        {tab === 1 && (
          <SummaryTab
            loan={loan}
          />
        )}

        {tab === 2 && (
          <PassbookTab
            passbook={passbook}
          />
        )}
      </Box>
    </Box>
  );
}