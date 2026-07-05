"use client";

import { useState } from "react";

import {
  Box,
  Tab,
  Tabs,
} from "@mui/material";

import CommitteeTab from "./tabs/CommitteeTab";
import GeneralTab from "./tabs/GeneralTab";
import MembersTab from "./tabs/MembersTab";
import OpeningAccountsTab from "./tabs/OpeningAccountsTab";
import SummaryTab from "./tabs/SummaryTab";
import { FinancialYearDetails } from "../types";

type MemberLookup = {
  _id: string;
  memberCode: string;
  name: string;
};

type Props = {
  financialYear: FinancialYearDetails;
  members: MemberLookup[];
};

export default function FinancialYearTabs({
  financialYear,
  members
}: Props) {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="General" />
        <Tab label="Members" />
        <Tab label="Committee" />
        <Tab label="Accounts" />
        <Tab label="Summary" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tab === 0 && (
          <GeneralTab
            financialYear={financialYear}
          />
        )}

        {tab === 1 && (
          <MembersTab
            financialYear={financialYear}
             members={members}
          />
        )}

        {tab === 2 && (
          <CommitteeTab
            financialYear={financialYear}
            members={members}
          />
        )}

        {tab === 3 && (
          <OpeningAccountsTab
            financialYear={financialYear}
          />
        )}

        {tab === 4 && (
          <SummaryTab
            financialYear={financialYear}
          />
        )}
      </Box>
    </>
  );
}