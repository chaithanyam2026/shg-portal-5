import type { SyntheticEvent } from "react";

import { Tab, Tabs } from "@mui/material";

import type { MeetingStatus } from "../domain/meeting-status";

export const MEETING_TAB_SLUGS = [
  "general",
  "attendance",
  "payments",
  "loan",
  "bank",
  "income",
  "expenses",
  "members",
  "summary",
] as const;

export type MeetingTabSlug = (typeof MEETING_TAB_SLUGS)[number];

const TABS: {
  label: string;
  slug: MeetingTabSlug;
  disabledWhenDraft: boolean;
}[] = [
  { label: "General", slug: "general", disabledWhenDraft: false },
  { label: "Attendance", slug: "attendance", disabledWhenDraft: true },
  { label: "Payments", slug: "payments", disabledWhenDraft: true },
  { label: "Loans", slug: "loan", disabledWhenDraft: true },
  { label: "Bank", slug: "bank", disabledWhenDraft: true },
  { label: "Income", slug: "income", disabledWhenDraft: true },
  { label: "Expenses", slug: "expenses", disabledWhenDraft: true },
  { label: "Members", slug: "members", disabledWhenDraft: true },
  { label: "Summary", slug: "summary", disabledWhenDraft: true },
];

export function resolveMeetingTabIndex(tab?: string | null): number {
  if (!tab) {
    return 0;
  }

  const normalized = tab.toLowerCase();

  const index = MEETING_TAB_SLUGS.indexOf(normalized as MeetingTabSlug);

  return index >= 0 ? index : 0;
}

type Props = {
  value: number;
  status: MeetingStatus;
  onChange: (event: SyntheticEvent, value: number) => void;
};

export default function MeetingTabs({ value, status, onChange }: Props) {
  return (
    <Tabs value={value} onChange={onChange} variant="scrollable" scrollButtons="auto">
      {TABS.map((tab, index) => (
        <Tab
          key={tab.slug}
          label={tab.label}
          disabled={tab.disabledWhenDraft && status === "DRAFT"}
          value={index}
        />
      ))}
    </Tabs>
  );
}
