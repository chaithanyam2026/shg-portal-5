"use client";

import { createContext, useCallback, useContext, useState, type PropsWithChildren } from "react";

type MeetingDataRefreshContextValue = {
  refreshKey: number;
  refreshMeetingData: () => void;
};

const MeetingDataRefreshContext = createContext<MeetingDataRefreshContextValue | null>(null);

export function MeetingDataRefreshProvider({ children }: PropsWithChildren) {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshMeetingData = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return (
    <MeetingDataRefreshContext.Provider value={{ refreshKey, refreshMeetingData }}>
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
