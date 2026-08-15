"use client";

import { useEffect, useState } from "react";

import { Alert, Box, CircularProgress } from "@mui/material";

import type {
  AttendanceSummary,
  BankTransactionSummary,
  ExpenseSummary,
  IncomeSummary,
  MeetingDashboardSummary,
  MeetingLoansSummary,
  MemberTransactionsSummary,
  PaymentSummary,
} from "../types";

import AttendanceForm from "./AttendanceForm";
import BankTransactionForm from "./BankTransactionForm";
import ExpenseForm from "./ExpenseForm";
import IncomeForm from "./IncomeForm";
import MeetingLoanForm from "./MeetingLoanForm";
import MemberTransactionsView from "./MemberTransactionsView";
import PaymentForm from "./PaymentForm";
import SummaryView from "./SummaryView";

type LoaderProps = {
  meetingId: string;
};

function TabLoader({ label }: { label: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
      <CircularProgress aria-label={`Loading ${label}`} />
    </Box>
  );
}

function useMeetingTabData<T>(meetingId: string, path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/meetings/${meetingId}/${path}`);

        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.message ?? `Unable to load ${path}.`);
        }

        if (!cancelled) {
          setData(body as T);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : `Unable to load ${path}.`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [meetingId, path]);

  return { data, loading, error };
}

function TabError({ message }: { message: string }) {
  return <Alert severity="error">{message}</Alert>;
}

export function AttendanceTabPanel({ meetingId }: LoaderProps) {
  const { data, loading, error } = useMeetingTabData<AttendanceSummary>(meetingId, "attendance");

  if (loading) {
    return <TabLoader label="attendance" />;
  }

  if (error) {
    return <TabError message={error} />;
  }

  if (!data) {
    return null;
  }

  return <AttendanceForm meetingId={meetingId} initialRecords={data.records} />;
}

export function PaymentsTabPanel({ meetingId }: LoaderProps) {
  const { data, loading, error } = useMeetingTabData<PaymentSummary>(meetingId, "payments");

  if (loading) {
    return <TabLoader label="payments" />;
  }

  if (error) {
    return <TabError message={error} />;
  }

  if (!data) {
    return null;
  }

  return <PaymentForm meetingId={meetingId} initialRecords={data.records} />;
}

export function LoansTabPanel({ meetingId }: LoaderProps) {
  const { data, loading, error } = useMeetingTabData<MeetingLoansSummary>(meetingId, "loans");

  if (loading) {
    return <TabLoader label="loans" />;
  }

  if (error) {
    return <TabError message={error} />;
  }

  if (!data) {
    return null;
  }

  return <MeetingLoanForm initialSummary={data} />;
}

export function BankTabPanel({ meetingId }: LoaderProps) {
  const { data, loading, error } = useMeetingTabData<BankTransactionSummary>(meetingId, "bank");

  if (loading) {
    return <TabLoader label="bank transactions" />;
  }

  if (error) {
    return <TabError message={error} />;
  }

  if (!data) {
    return null;
  }

  return <BankTransactionForm meetingId={meetingId} initialSummary={data} />;
}

export function IncomeTabPanel({ meetingId }: LoaderProps) {
  const { data, loading, error } = useMeetingTabData<IncomeSummary>(meetingId, "income");

  if (loading) {
    return <TabLoader label="income" />;
  }

  if (error) {
    return <TabError message={error} />;
  }

  if (!data) {
    return null;
  }

  return <IncomeForm meetingId={meetingId} initialSummary={data} />;
}

export function ExpensesTabPanel({ meetingId }: LoaderProps) {
  const { data, loading, error } = useMeetingTabData<ExpenseSummary>(meetingId, "expenses");

  if (loading) {
    return <TabLoader label="expenses" />;
  }

  if (error) {
    return <TabError message={error} />;
  }

  if (!data) {
    return null;
  }

  return <ExpenseForm meetingId={meetingId} initialSummary={data} />;
}

export function MembersTabPanel({ meetingId }: LoaderProps) {
  const { data, loading, error } = useMeetingTabData<MemberTransactionsSummary>(
    meetingId,
    "member-transactions",
  );

  if (loading) {
    return <TabLoader label="member transactions" />;
  }

  if (error) {
    return <TabError message={error} />;
  }

  if (!data) {
    return null;
  }

  return <MemberTransactionsView summary={data} />;
}

export function SummaryTabPanel({ meetingId }: LoaderProps) {
  const { data, loading, error } = useMeetingTabData<MeetingDashboardSummary>(
    meetingId,
    "summary",
  );

  if (loading) {
    return <TabLoader label="summary" />;
  }

  if (error) {
    return <TabError message={error} />;
  }

  if (!data) {
    return null;
  }

  return <SummaryView meetingId={meetingId} summary={data} />;
}
