"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export type MeetingUnsavedSection = "attendance" | "payments" | "bank" | "income" | "expenses";

const SECTION_LABELS: Record<MeetingUnsavedSection, string> = {
  attendance: "attendance",
  payments: "payments",
  bank: "bank transactions",
  income: "income",
  expenses: "expenses",
};

type MeetingDataRefreshContextValue = {
  refreshKey: number;
  refreshMeetingData: () => void;
  setSectionUnsaved: (section: MeetingUnsavedSection, unsaved: boolean) => void;
  unsavedSectionLabels: string[];
};

const MeetingDataRefreshContext = createContext<MeetingDataRefreshContextValue | null>(null);

export function MeetingDataRefreshProvider({ children }: PropsWithChildren) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [unsavedSections, setUnsavedSections] = useState<Set<MeetingUnsavedSection>>(new Set());

  const refreshMeetingData = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  const setSectionUnsaved = useCallback((section: MeetingUnsavedSection, unsaved: boolean) => {
    setUnsavedSections((current) => {
      const next = new Set(current);

      if (unsaved) {
        next.add(section);
      } else {
        next.delete(section);
      }

      if (next.size === current.size && unsaved === current.has(section)) {
        return current;
      }

      return next;
    });
  }, []);

  const unsavedSectionLabels = useMemo(
    () =>
      Array.from(unsavedSections).map((section) => SECTION_LABELS[section]),
    [unsavedSections],
  );

  return (
    <MeetingDataRefreshContext.Provider
      value={{ refreshKey, refreshMeetingData, setSectionUnsaved, unsavedSectionLabels }}
    >
      {children}
    </MeetingDataRefreshContext.Provider>
  );
}

export function useMeetingDataRefresh() {
  const context = useContext(MeetingDataRefreshContext);

  if (!context) {
    throw new Error("useMeetingDataRefresh must be used within MeetingDataRefreshProvider.");
  }

  return context;
}

export function useMeetingUnsavedSection(section: MeetingUnsavedSection, unsaved: boolean) {
  const { setSectionUnsaved } = useMeetingDataRefresh();

  useEffect(() => {
    setSectionUnsaved(section, unsaved);

    return () => {
      setSectionUnsaved(section, false);
    };
  }, [section, unsaved, setSectionUnsaved]);
}
