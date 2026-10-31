import type { ChittyEditorRole } from "./domain";
import type { ChittyStatus } from "./domain/chitty-status";

export type ChittySchemeOption = {
  id: string;
  name: string;
  code: string;
  status: ChittyStatus;
  startDate: string;
  weeklyAmount: number;
  isAuction: boolean;
};

export type ChittyPaymentRecord = {
  chittyUserId: string;
  userName: string;
  phone: string;
  agentMemberId: string;
  agentMemberName: string;
  paid: boolean;
  previousBalancePayment: number;
  pendingBalance: number;
  auctionAmount: number;
};

export type ChittyAgentSummary = {
  agentMemberId: string;
  agentMemberName: string;
  weeklyPaid: number;
  previousBalancePaid: number;
  total: number;
};

export type ChittySettlement = {
  previousPending: number;
  collected: number;
  collection: number;
  disbursedAmount: number;
  balance: number;
};

export type ChittyPaymentView = {
  chittyId: string;
  chittyName: string;
  chittyStatus: ChittyStatus;
  schemes: ChittySchemeOption[];
  date: string;
  dateOptions: string[];
  dayClosed: boolean;
  schemeClosed: boolean;
  editorRole: ChittyEditorRole;
  canEditPayments: boolean;
  canEditAll: boolean;
  canEditDisbursement: boolean;
  canCloseDay: boolean;
  blockReason: string | null;
  currentMemberId: string | null;
  weeklyAmount: number;
  isAuction: boolean;
  records: ChittyPaymentRecord[];
  summaries: ChittyAgentSummary[];
  grandTotal: number;
  settlement: ChittySettlement | null;
};

export type ChittyUserHistoryPayment = {
  date: string;
  amount: number | null;
};

export type ChittyUserHistoryRow = {
  chittyUserId: string;
  userName: string;
  payments: ChittyUserHistoryPayment[];
  pendingCount: number;
  winDate: string | null;
};

export type ChittyUserHistoryGroup = {
  agentMemberId: string;
  agentMemberName: string;
  users: ChittyUserHistoryRow[];
};

export type ChittyUserHistory = {
  dates: string[];
  canRecordWin: boolean;
  groups: ChittyUserHistoryGroup[];
};

export type ChittyHistoryRow = {
  date: string;
  collected: number;
  previousPending: number;
  collection: number;
  disbursedAmount: number;
  balance: number;
  closed: boolean;
};
