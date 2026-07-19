"use client";

import { useState } from "react";

import Link from "next/link";

import { Box, Button, Stack, Tab, Tabs } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import type { AttendanceFineSummary } from "@/features/reports/domain";

import type { MemberDetails } from "../types";

import AttendanceFineTab from "./tabs/AttendanceFineTab";
import GeneralTab from "./tabs/GeneralTab";
import LoansTab from "./tabs/LoansTab";
import PassbookTab from "./tabs/PassbookTab";

type Props = {
  attendanceFine: AttendanceFineSummary;
  member: MemberDetails;
};

export default function MemberTabs({ member, attendanceFine }: Props) {
  const [tab, setTab] = useState(0);

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PageHeader title={member.name} subtitle={member.memberCode} backHref="/members" />

        <Button component={Link} href="/members/new" variant="contained">
          New Member
        </Button>
      </Stack>

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

          <Tab label="Attendance Fine" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <GeneralTab member={member} />}

          {tab === 1 && <LoansTab member={member} />}

          {tab === 2 && <PassbookTab member={member} />}

          {tab === 3 && <AttendanceFineTab attendanceFine={attendanceFine} />}
        </Box>
      </Box>
    </Stack>
  );
}
