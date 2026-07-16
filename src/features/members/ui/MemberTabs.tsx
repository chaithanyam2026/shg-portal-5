"use client";

import { useState } from "react";

import {
  Box,
  Tab,
  Tabs,
} from "@mui/material";

import type {
  MemberDetails,
} from "../types";

import GeneralTab from "./tabs/GeneralTab";
import LoansTab from "./tabs/LoansTab";
import PassbookTab from "./tabs/PassbookTab";

type Props = {
  member: MemberDetails;
};

export default function MemberTabs({
  member,
}: Props) {
  const [tab, setTab] =
    useState(0);

  return (
    <Box>
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
          label="Loans"
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
            member={member}
          />
        )}

         {tab === 1 && (
           <LoansTab
             member={member}
          />
         )} 

        {tab === 2 && (
          <PassbookTab
            member={member}
          />
        )}
      </Box>
    </Box>
  );
}