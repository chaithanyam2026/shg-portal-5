"use client";

import { useState } from "react";

import { Alert, Box, Tab, Tabs } from "@mui/material";

import type { IncomeExpenseReport as IncomeExpenseReportModel } from "@/features/reports/types";
import { IncomeExpenseReport } from "@/features/reports/ui";
import type { FinancialYearDetails, MemberLookup } from "../types";
import CommitteeTab from "./tabs/CommitteeTab";
import GeneralTab from "./tabs/GeneralTab";
import MembersTab from "./tabs/MembersTab";
import OpeningAccountsTab from "./tabs/OpeningAccountsTab";
import SummaryTab from "./tabs/SummaryTab";

type Props = {
  financialYear: FinancialYearDetails;
  members: MemberLookup[];
  report: IncomeExpenseReportModel;
  canEdit: boolean;
  canReopen?: boolean;
};

export default function FinancialYearTabs({
  financialYear,
  members,
  report,
  canEdit,
  canReopen = false,
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
        <Tab label="Income & Expense" />
        <Tab label="Summary" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {financialYear.status === "IN_PROGRESS" && !canEdit && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Only the president, secretary, or treasurer of this financial year can edit these
            fields.
          </Alert>
        )}

        {tab === 0 && <GeneralTab financialYear={financialYear} canEdit={canEdit} />}

        {tab === 1 && (
          <MembersTab financialYear={financialYear} members={members} canEdit={canEdit} />
        )}

        {tab === 2 && (
          <CommitteeTab financialYear={financialYear} members={members} canEdit={canEdit} />
        )}

        {tab === 3 && <OpeningAccountsTab financialYear={financialYear} canEdit={canEdit} />}

        {tab === 4 && <IncomeExpenseReport report={report} />}

        {tab === 5 && (
          <SummaryTab financialYear={financialYear} canEdit={canEdit} canReopen={canReopen} />
        )}
      </Box>
    </>
  );
}
