"use client";

import { SyntheticEvent } from "react";

import { usePathname, useRouter } from "next/navigation";

import { Tab, Tabs } from "@mui/material";

import type { MeetingStatus } from "../domain/meeting-status";

type Props = {
  meetingId: string;
  status: MeetingStatus;
};

export default function MeetingTabs({ meetingId, status }: Props) {
  const router = useRouter();

  const pathname = usePathname();

  const tabs = [
    {
      label: "General",
      href: "",
      disabled: false,
    },
    {
      label: "Attendance",
      href: "/attendance",
      disabled: status === "DRAFT",
    },
    {
      label: "Payments",
      href: "/payments",
      disabled: status === "DRAFT",
    },
    {
      label: "Bank",
      href: "/bank",
      disabled: status === "DRAFT",
    },
    {
      label: "Income",
      href: "/income",
      disabled: status === "DRAFT",
    },
    {
      label: "Expenses",
      href: "/expenses",
      disabled: status === "DRAFT",
    },
    {
      label: "Summary",
      href: "/summary",
      disabled: status === "DRAFT",
    },
  ];

  const value = tabs.findIndex((tab) => {
    const path = `/meetings/${meetingId}${tab.href}`;
    return pathname === path;
  });

  function handleChange(_event: SyntheticEvent, index: number) {
    router.push(`/meetings/${meetingId}${tabs[index].href}`);
  }

  return (
    <Tabs
      value={value < 0 ? 0 : value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
    >
      {tabs.map((tab) => (
        <Tab key={tab.label} label={tab.label} disabled={tab.disabled} />
      ))}
    </Tabs>
  );
}
