import { APP_TIMEZONE, formatDate } from "@/lib/utils/date";

/**
 * Labels used on the meeting-close table image.
 * Rename `labels` to change the words in the image.
 * The greeting is drawn at the top as `Hi {member name},`.
 */
export const WHATSAPP_TEMPLATE = {
  labels: {
    attendance: "Attendance",
    contributionPaid: "Contribution paid",
    loanRepayment: "Loan repayment",
    absentFinePaid: "Absent fine paid",
    pendingContribution: "Pending contribution",
    pendingAbsentFine: "Pending absent fine",
    total: "Total",
    income: "Income",
    expense: "Expense",
    totalIncome: "Total income",
    totalExpense: "Total expense",
    cashInHand: "Cash in hand",
    bankBalance: "Bank balance",
  },
} as const;

export type MeetingCloseMemberLine = {
  name: string;
  attendanceLabel: string;
  contributionPaid: number;
  loanRepayment: number;
  absentFinePaid: number;
  pendingContribution: number;
  pendingAbsentFine: number;
};

export type MeetingCloseAmountLine = {
  categoryLabel: string;
  amount: number;
};

export type MeetingCloseMessageContent = {
  members: MeetingCloseMemberLine[];
  incomes: MeetingCloseAmountLine[];
  expenses: MeetingCloseAmountLine[];
  cashInHand: number;
  bankBalance: number;
};

export function formatClosingTime(value: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: APP_TIMEZONE,
  }).format(value);
}

export function formatMeetingCloseDate(value: Date): string {
  return formatDate(value);
}

/** WhatsApp template parameters cannot contain line breaks. */
export function toWhatsappParameterText(value: string): string {
  return value
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ {5,}/g, "    ")
    .trim()
    .slice(0, 900);
}
