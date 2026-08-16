import type { FinancialYearStatus } from "@/features/financial-year/domain/financial-year-status";

import type { AttendanceStatus } from "./domain/attendance-status";
import type { BankTransactionType } from "./domain/bank-transaction";
import type { ExpenseCategory } from "./domain/expense";
import type { IncomeCategory } from "./domain/income";
import type { MeetingStatus } from "./domain/meeting-status";
import type { ValidationCode, ValidationSeverity } from "./domain/summary";

export type MeetingSummary = {
  id: string;
  meetingDate: string;
  place: string;
  status: MeetingStatus;
  createdAt: string;
};

export type MeetingDetails = {
  id: string;
  financialYearId: string;
  financialYearStatus: FinancialYearStatus;

  canEdit: boolean;
  canReopen: boolean;
  canDelete: boolean;

  meetingDate: string;

  place: string;

  agenda: string;

  remarks: string;

  status: MeetingStatus;

  startedAt: string | null;

  approvedAt: string | null;

  closedAt: string | null;

  createdBy: string | null;

  updatedBy: string | null;

  createdAt: string;

  updatedAt: string;
};

export type MeetingListFilter = {
  page: number;
  pageSize: number;
  search?: string;
  status?: MeetingStatus;
  sort?: "meetingDate" | "-meetingDate";
  financialYearId?: string;
};

export type MeetingListResult = {
  items: MeetingSummary[];
  total: number;
  page: number;
  pageSize: number;
};

export type AttendanceRecord = {
  memberId: string;

  memberCode: string;

  memberName: string;

  status: AttendanceStatus;

  remarks: string;
};

export type AttendanceSummary = {
  meetingId: string;

  status: MeetingStatus;

  records: AttendanceRecord[];

  saved: boolean;
};

export type PaymentRecord = {
  memberId: string;

  memberCode: string;

  memberName: string;

  contribution: number;

  loanRepayment: number;

  absentFine: number;

  specialLoanFine: number;

  remarks: string;

  total: number;

  /** Weekly contribution still owed before this meeting's entered amount. Negative = prepaid. */
  contributionDue: number;

  /** Absent fine still owed before this meeting's entered amount. Negative = overpaid. */
  absentFineDue: number;

  /** Current outstanding loan principal (last passbook outstanding value). */
  outstandingPrincipal: number;
};

export type PaymentSummary = {
  meetingId: string;

  status: MeetingStatus;

  records: PaymentRecord[];

  totalContribution: number;

  totalLoanRepayment: number;

  totalAbsentFine: number;

  totalSpecialLoanFine: number;

  grandTotal: number;

  saved: boolean;
};

export type MemberMeetingTransactions = {
  memberId: string;
  memberCode: string;
  memberName: string;
  attendanceStatus: AttendanceStatus | null;
  attendanceRemarks: string;
  contribution: number;
  loanRepayment: number;
  absentFine: number;
  specialLoanFine: number;
  total: number;
};

export type MemberTransactionsSummary = {
  meetingId: string;
  meetingDate: string;
  status: MeetingStatus;
  records: MemberMeetingTransactions[];
  totalContribution: number;
  totalLoanRepayment: number;
  totalAbsentFine: number;
  totalSpecialLoanFine: number;
  grandTotal: number;
};

export type BankTransactionRecord = {
  transactionDate: string;

  type: BankTransactionType;

  amount: number;

  remarks: string;
};

export type BankTransactionSummary = {
  meetingId: string;

  status: MeetingStatus;

  records: BankTransactionRecord[];

  totalDeposits: number;

  totalWithdrawals: number;

  netAmount: number;
};

export type IncomeRecord = {
  transactionDate: string;

  category: IncomeCategory;

  amount: number;

  remarks: string;
};

export type IncomeSummary = {
  meetingId: string;

  status: MeetingStatus;

  records: IncomeRecord[];

  totalIncome: number;
};

export type ExpenseRecord = {
  transactionDate: string;

  category: ExpenseCategory;

  amount: number;

  remarks: string;
};

export type ExpenseSummary = {
  meetingId: string;

  status: MeetingStatus;

  records: ExpenseRecord[];

  totalExpense: number;
};

export type AttendanceStatistics = {
  totalMembers: number;

  present: number;

  absent: number;

  leave: number;
};

export type MemberPaymentSummary = {
  contribution: number;

  loanRepayment: number;

  absentFine: number;

  specialLoanFine: number;

  totalCollection: number;
};

export type FinancialSummary = {
  memberCollection: number;

  otherIncome: number;

  expenses: number;

  netMeetingCollection: number;

  bankDeposits: number;

  bankWithdrawals: number;

  netBankMovement: number;
};

export type SummaryValidation = {
  code: ValidationCode;

  title: string;

  severity: ValidationSeverity;

  message: string;
};

export type MeetingDashboardSummary = {
  meetingId: string;

  status: MeetingStatus;

  meetingDate: string;

  place: string;

  startedAt: string | null;

  attendance: AttendanceStatistics;

  payments: MemberPaymentSummary;

  bank: BankTransactionSummary;

  income: IncomeSummary;

  expenses: ExpenseSummary;

  financial: FinancialSummary;

  validations: SummaryValidation[];

  canClose: boolean;
};

export type MeetingLoanRecord = {
  _id: string;
  loanNumber: string;
  memberId: string;
  memberCode: string;
  memberName: string;
  loanType: string;
  sanctionedAmount: number;
  disbursedAmount: number;
  sanctionedDate: string;
  disbursedDate: string;
  expiryDate: string | null;
};

export type MeetingLoansSummary = {
  meetingId: string;
  financialYearId: string;
  meetingDate: string;
  status: MeetingStatus;
  members: {
    _id: string;
    memberCode: string;
    name: string;
  }[];
  loans: MeetingLoanRecord[];
};
