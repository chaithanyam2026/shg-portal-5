"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import { parseDateInputValue } from "@/lib/utils/date";
import { formatCurrency, formatDate } from "@/lib/utils/format";

import {
  CHITTY_PAYMENT_LOCK_LABEL,
  canCloseChittyDay,
  canEditChittyDisbursement,
  canEditChittyPaymentRow,
  canEditChittySheet,
  chittyEditBlockReason,
  isAfterChittyPaymentCutoff,
  isCurrentChittySunday,
  payablePreviousBalance,
  roundMoney,
  userPaymentAmount,
} from "../domain";
import type {
  ChittyAgentSummary,
  ChittyHistoryRow,
  ChittyPaymentRecord,
  ChittyPaymentView,
  ChittyUserHistory,
} from "../types";

import ChittyAuctionTable from "./ChittyAuctionTable";
import ChittyHistoryTable from "./ChittyHistoryTable";
import ChittyPaymentTable from "./ChittyPaymentTable";
import ChittySummaryTable from "./ChittySummaryTable";
import ChittyUserHistoryTable from "./ChittyUserHistoryTable";
import NumberField from "./NumberField";

type Props = {
  initialSheet: ChittyPaymentView;
};

type DashboardTab = "payments" | "auction" | "history" | "users";

function recordAmount(record: ChittyPaymentRecord, weeklyAmount: number): number {
  return userPaymentAmount(
    record.paid,
    weeklyAmount,
    record.pendingBalance,
    record.previousBalancePayment,
  );
}

function liveAccess(sheet: ChittyPaymentView) {
  const now = new Date();
  const sheetDate = parseDateInputValue(sheet.date);
  const flags = {
    role: sheet.editorRole,
    schemeClosed: sheet.schemeClosed,
    dayClosed: sheet.dayClosed,
    isCurrentSunday: isCurrentChittySunday(now, sheetDate),
    afterCutoff: isAfterChittyPaymentCutoff(now, sheetDate),
  };

  return {
    canEditPayments: canEditChittySheet(flags),
    canEditDisbursement: canEditChittyDisbursement(flags),
    canCloseDay: canCloseChittyDay(flags),
    blockReason: chittyEditBlockReason({
      ...flags,
      lockLabel: CHITTY_PAYMENT_LOCK_LABEL,
    }),
  };
}

function summariesFrom(records: ChittyPaymentRecord[], weeklyAmount: number): ChittyAgentSummary[] {
  const grouped = new Map<string, ChittyAgentSummary>();

  for (const record of records) {
    const current = grouped.get(record.agentMemberId) ?? {
      agentMemberId: record.agentMemberId,
      agentMemberName: record.agentMemberName,
      weeklyPaid: 0,
      previousBalancePaid: 0,
      total: 0,
    };
    const previousBalancePaid = payablePreviousBalance(
      record.pendingBalance,
      record.previousBalancePayment,
    );

    current.weeklyPaid = roundMoney(current.weeklyPaid + (record.paid ? weeklyAmount : 0));
    current.previousBalancePaid = roundMoney(current.previousBalancePaid + previousBalancePaid);
    current.total = roundMoney(current.weeklyPaid + current.previousBalancePaid);
    grouped.set(record.agentMemberId, current);
  }

  return [...grouped.values()].sort((left, right) =>
    left.agentMemberName.localeCompare(right.agentMemberName),
  );
}

export default function ChittyDashboard({ initialSheet }: Props) {
  const [sheet, setSheet] = useState(initialSheet);
  const [records, setRecords] = useState<ChittyPaymentRecord[]>(initialSheet.records);
  const [disbursedAmount, setDisbursedAmount] = useState(
    initialSheet.settlement?.disbursedAmount ?? 0,
  );
  const [access, setAccess] = useState({
    canEditPayments: initialSheet.canEditPayments,
    canEditDisbursement: initialSheet.canEditDisbursement,
    canCloseDay: initialSheet.canCloseDay,
    blockReason: initialSheet.blockReason,
  });
  const [tab, setTab] = useState<DashboardTab>("payments");
  const [history, setHistory] = useState<ChittyHistoryRow[]>([]);
  const [userHistory, setUserHistory] = useState<ChittyUserHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    function refreshAccess() {
      setAccess(liveAccess(sheet));
    }

    refreshAccess();
    const timer = window.setInterval(refreshAccess, 15_000);
    return () => window.clearInterval(timer);
  }, [sheet]);

  function applySheet(next: ChittyPaymentView) {
    setSheet(next);
    setRecords(next.records);
    setDisbursedAmount(next.settlement?.disbursedAmount ?? 0);
    setAccess(liveAccess(next));
    setTab((current) => (current === "auction" && !next.isAuction ? "payments" : current));
  }

  async function loadSheet(chittyId: string, date?: string) {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const params = new URLSearchParams({ chittyId });

      if (date) {
        params.set("date", date);
      }

      const response = await fetch(`/api/chitty/payments?${params.toString()}`);
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to load chitty payments.");
      }

      applySheet(body);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load chitty payments.");
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory(chittyId: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/chitty/history?chittyId=${encodeURIComponent(chittyId)}`);
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to load chitty history.");
      }

      setHistory(body);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load chitty history.");
    } finally {
      setLoading(false);
    }
  }

  async function loadUserHistory(chittyId: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/chitty/user-history?chittyId=${encodeURIComponent(chittyId)}`,
      );
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to load chitty user history.");
      }

      setUserHistory(body);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load chitty user history.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveWinDate(chittyUserId: string, winDate: string | null) {
    if (!userHistory) {
      return;
    }

    const previous = userHistory;

    setUserHistory({
      ...userHistory,
      groups: userHistory.groups.map((group) => ({
        ...group,
        users: group.users.map((user) =>
          user.chittyUserId === chittyUserId ? { ...user, winDate } : user,
        ),
      })),
    });

    try {
      setError("");
      const response = await fetch(`/api/chitty/users/${chittyUserId}/win-date`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winDate }),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to save the win date.");
      }
    } catch (saveError) {
      setUserHistory(previous);
      setError(saveError instanceof Error ? saveError.message : "Unable to save the win date.");
    }
  }

  async function save() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/chitty/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chittyId: sheet.chittyId,
          date: sheet.date,
          records,
          disbursedAmount: access.canEditDisbursement ? disbursedAmount : undefined,
        }),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to save chitty payments.");
      }

      applySheet(body);
      setSuccess("Payments saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save chitty payments.");
    } finally {
      setSaving(false);
    }
  }

  async function closeDay() {
    if (!window.confirm("Close this Sunday? Only an admin can change it after closing.")) {
      return;
    }

    try {
      setClosing(true);
      setError("");
      setSuccess("");

      if (canSave) {
        const saveResponse = await fetch("/api/chitty/payments", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chittyId: sheet.chittyId,
            date: sheet.date,
            records,
            disbursedAmount: access.canEditDisbursement ? disbursedAmount : undefined,
          }),
        });
        const saveBody = await saveResponse.json();

        if (!saveResponse.ok) {
          throw new Error(saveBody.message ?? "Unable to save chitty payments.");
        }
      }

      const response = await fetch("/api/chitty/weeks/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chittyId: sheet.chittyId,
          date: sheet.date,
        }),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Unable to close this Sunday.");
      }

      applySheet(body);
      setSuccess("Sunday closed.");
    } catch (closeError) {
      setError(closeError instanceof Error ? closeError.message : "Unable to close this Sunday.");
    } finally {
      setClosing(false);
    }
  }

  const canSave =
    !loading &&
    (records.some((record) =>
      canEditChittyPaymentRow({
        canEditSheet: access.canEditPayments,
        canEditAll: sheet.canEditAll,
        currentMemberId: sheet.currentMemberId,
        rowAgentMemberId: record.agentMemberId,
      }),
    ) ||
      access.canEditDisbursement);

  const activeTab: DashboardTab = tab === "auction" && !sheet.isAuction ? "payments" : tab;
  const collected = records.reduce(
    (sum, record) => sum + recordAmount(record, sheet.weeklyAmount),
    0,
  );
  const collection = (sheet.settlement?.previousPending ?? 0) + collected;
  const weekBalance =
    collection -
    (access.canEditDisbursement ? disbursedAmount : (sheet.settlement?.disbursedAmount ?? 0));
  const busy = loading || saving || closing;

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {sheet.schemes.length === 0 ? (
        <Alert
          severity="info"
          action={
            sheet.editorRole === "admin" ? (
              <Button color="inherit" component={Link} href="/chitty/schemes" size="small">
                Create chitty
              </Button>
            ) : undefined
          }
        >
          No chitties yet.
        </Alert>
      ) : (
        <>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { sm: "center" } }}
          >
            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel>Chitty</InputLabel>
              <Select
                label="Chitty"
                value={sheet.chittyId}
                disabled={busy}
                onChange={(event) => {
                  const chittyId = event.target.value;
                  void loadSheet(chittyId);
                  if (activeTab === "history") {
                    void loadHistory(chittyId);
                  }
                  if (activeTab === "users") {
                    void loadUserHistory(chittyId);
                  }
                }}
              >
                {sheet.schemes.map((scheme) => (
                  <MenuItem key={scheme.id} value={scheme.id}>
                    {scheme.name} ({scheme.status === "ACTIVE" ? "Active" : "Closed"})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {(activeTab === "payments" || activeTab === "auction") && (
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>Sunday</InputLabel>
                <Select
                  label="Sunday"
                  value={sheet.date}
                  disabled={busy}
                  onChange={(event) => loadSheet(sheet.chittyId, event.target.value)}
                >
                  {sheet.dateOptions.map((date) => (
                    <MenuItem key={date} value={date}>
                      {formatDate(date)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {sheet.editorRole === "admin" && (
              <Button component={Link} href="/chitty/schemes" sx={{ alignSelf: "flex-start" }}>
                Manage chitties
              </Button>
            )}
          </Stack>

          <Tabs
            value={activeTab}
            onChange={(_event, value: DashboardTab) => {
              setTab(value);
              if (value === "history" && sheet.chittyId) {
                void loadHistory(sheet.chittyId);
              }
              if (value === "users" && sheet.chittyId) {
                void loadUserHistory(sheet.chittyId);
              }
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value="payments" label="Payments" />
            {sheet.isAuction && <Tab value="auction" label="Auction" />}
            <Tab value="history" label="History" />
            <Tab value="users" label="User history" />
          </Tabs>

          {activeTab === "payments" && (
            <Stack spacing={3}>
              {access.blockReason && <Alert severity="info">{access.blockReason}</Alert>}

              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">{sheet.chittyName}</Typography>
                    <Typography color="text.secondary">
                      Weekly amount: {formatCurrency(sheet.weeklyAmount)}. Checking Pay records this
                      amount for the week.
                    </Typography>
                    {sheet.weeklyAmount <= 0 && (
                      <Alert severity="warning">
                        Set a weekly amount for this chitty before recording payments.
                      </Alert>
                    )}
                    <ChittyPaymentTable
                      records={records}
                      weeklyAmount={sheet.weeklyAmount}
                      isAuction={sheet.isAuction}
                      canEditAll={sheet.canEditAll}
                      canEditSheet={access.canEditPayments}
                      currentMemberId={sheet.currentMemberId}
                      disabled={busy}
                      onChange={setRecords}
                    />
                    {canSave && (
                      <Button
                        variant="contained"
                        disabled={saving}
                        onClick={save}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        Save payments
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">Week summary</Typography>
                    <ChittySummaryTable summaries={summariesFrom(records, sheet.weeklyAmount)} />
                    {sheet.settlement && (
                      <>
                        <Stack spacing={0.5}>
                          <Typography>
                            Previous pending: {formatCurrency(sheet.settlement.previousPending)}
                          </Typography>
                          <Typography>Collected this week: {formatCurrency(collected)}</Typography>
                          <Typography>Collection amount: {formatCurrency(collection)}</Typography>
                          <Typography>Week balance: {formatCurrency(weekBalance)}</Typography>
                        </Stack>
                        <NumberField
                          label="Chitty disbursed amount"
                          size="small"
                          value={disbursedAmount}
                          disabled={!access.canEditDisbursement || busy}
                          onChange={setDisbursedAmount}
                          sx={{ maxWidth: 280 }}
                          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                        />
                        {access.canCloseDay && (
                          <Button
                            variant="outlined"
                            disabled={closing}
                            onClick={closeDay}
                            sx={{ alignSelf: "flex-start" }}
                          >
                            Close Sunday
                          </Button>
                        )}
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {activeTab === "auction" && sheet.isAuction && (
            <ChittyAuctionTable date={sheet.date} records={records} />
          )}

          {activeTab === "history" && <ChittyHistoryTable rows={history} />}

          {activeTab === "users" && userHistory && (
            <ChittyUserHistoryTable
              history={userHistory}
              disabled={loading}
              onWinDateChange={saveWinDate}
            />
          )}
        </>
      )}
    </Stack>
  );
}
