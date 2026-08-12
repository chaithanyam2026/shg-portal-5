"use client";

import { useState } from "react";

import Link from "next/link";

import { Box, Button, Stack, Tab, Tabs } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";
import FinancialYearSelector from "@/features/financial-year/ui/FinancialYearSelector";

import type { MemberDetails } from "../types";

import AttendanceFineTab from "./tabs/AttendanceFineTab";
import ContributionsTabLoader from "./tabs/ContributionsTabLoader";
import GeneralTab from "./tabs/GeneralTab";
import LoansTab from "./tabs/LoansTab";
import PassbookTab from "./tabs/PassbookTab";

type Props = {
  financialYearOptions: FinancialYearOption[];

  initialFinancialYearId: string;

  member: MemberDetails;
};

const FINANCIAL_YEAR_TABS = new Set([1, 2, 3, 4]);

export default function MemberTabs({
  member,
  financialYearOptions,
  initialFinancialYearId,
}: Props) {
  const [tab, setTab] = useState(0);

  const [financialYearId, setFinancialYearId] = useState(initialFinancialYearId);

  const showFinancialYearSelector = FINANCIAL_YEAR_TABS.has(tab);

  return (
    <Stack spacing={3}>
      <PageHeader title={member.name} subtitle={member.memberCode} backHref="/members">
        <Button component={Link} href="/members/new" variant="contained">
          New Member
        </Button>
      </PageHeader>

      <Box>
        <Tabs
          value={tab}
          onChange={(_event, value: number) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="General" />

          <Tab label="Loans" />

          <Tab label="Passbook" />

          <Tab label="Contributions" />

          <Tab label="Attendance Fine" />
        </Tabs>

        {showFinancialYearSelector && (
          <Box sx={{ mt: 2 }}>
            {financialYearOptions.length === 0 ? (
              <Box component="p" sx={{ color: "text.secondary", m: 0 }}>
                This member is not enrolled in any financial year.
              </Box>
            ) : (
              <FinancialYearSelector
                value={financialYearId}
                options={financialYearOptions}
                onChange={setFinancialYearId}
              />
            )}
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <GeneralTab member={member} />}

          {tab === 1 && <LoansTab member={member} financialYearId={financialYearId} />}

          {tab === 2 && <PassbookTab member={member} financialYearId={financialYearId} />}

          {tab === 3 && (
            <ContributionsTabLoader member={member} financialYearId={financialYearId} />
          )}

          {tab === 4 && (
            <AttendanceFineTab member={member} financialYearId={financialYearId} />
          )}
        </Box>
      </Box>
    </Stack>
  );
}
