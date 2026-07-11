import type { MeetingStatus } from "./domain/meeting-status";
import type { AttendanceStatus } from "./domain/attendance-status";
import type {
  BankTransactionType,
} from "./domain/bank-transaction";
import type {
  IncomeCategory,
} from "./domain/income";
import type {
  ExpenseCategory,
} from "./domain/expense";

import type {
  ValidationSeverity,
} from "./domain/summary";
import type {
  ValidationCode,
} from "./domain/summary";


export type MeetingSummary = {
  id: string;
  meetingDate: string; // ISO 8601
  place: string;
  status: MeetingStatus;
  createdAt: string; // ISO 8601
};

export type MeetingDetails = {
  id: string;
  financialYearId: string;

  meetingDate: string; // ISO 8601

  place: string;

  agenda: string;

  remarks: string;

  status: MeetingStatus;

  startedAt: string | null;

  approvedAt: string | null;

  closedAt: string | null;

  createdBy: string | null;

  updatedBy: string | null;

  createdAt: string; // ISO 8601

  updatedAt: string; // ISO 8601
};

export type MeetingListFilter = {
  page: number;
  pageSize: number;
  search?: string;
  status?: MeetingStatus;
  sort?: "meetingDate" | "-meetingDate";
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
};

export type PaymentRecord = {
  memberId: string;
  status: MeetingStatus;

  memberCode: string;

  memberName: string;

  contribution: number;

  loanRepayment: number;

  absentFine: number;

  specialLoanFine: number;

  remarks: string;

  total: number;
};

export type PaymentSummary = {
  meetingId: string;

  records: PaymentRecord[];

  totalContribution: number;

  totalLoanRepayment: number;

  totalAbsentFine: number;

  totalSpecialLoanFine: number;

  grandTotal: number;
};

export type BankTransactionRecord =
  {
    transactionDate: string;

    type: BankTransactionType;

    amount: number;

    remarks: string;
  };

export type BankTransactionSummary =
  {
    meetingId: string;

    status: MeetingStatus;

    records:
      BankTransactionRecord[];

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

export type AttendanceSummary = {
  totalMembers: number;

  present: number;

  absent: number;

  excused: number;
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
  title: string;

  severity: ValidationSeverity;

  message: string;
};

export type MeetingSummary = {
  meetingId: string;

  status: MeetingStatus;

  meetingDate: string;

  place: string;

  startedAt: string | null;

  attendance: AttendanceSummary;

  payments: MemberPaymentSummary;

  bank: BankTransactionSummary;

  income: IncomeSummary;

  expenses: ExpenseSummary;

  financial: FinancialSummary;

  validations: SummaryValidation[];

  canClose: boolean;
};

export type SummaryValidation = {
  code: ValidationCode;

  title: string;

  severity: ValidationSeverity;

  message: string;
};