import { z } from "zod";
import { ATTENDANCE_STATUS_VALUES } from "./domain/attendance-status";
import { BANK_TRANSACTION_TYPE_VALUES } from "./domain/bank-transaction";

import { INCOME_CATEGORY_VALUES } from "./domain/income";

import { EXPENSE_CATEGORY_VALUES } from "./domain/expense";

export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id.");

export const CreateMeetingSchema = z.object({
  meetingDate: z.coerce.date(),

  place: z.string().trim().min(2).max(150),

  agenda: z.string().trim().max(1000).optional().default(""),

  remarks: z.string().trim().max(2000).optional().default(""),
});

export const AttendanceRecordSchema = z.object({
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member id."),

  status: z.enum(ATTENDANCE_STATUS_VALUES),

  remarks: z.string().trim().max(500).optional().default(""),
});

export const UpdateAttendanceSchema = z.object({
  attendance: z.array(AttendanceRecordSchema),
});

export type UpdateAttendanceInput = z.infer<typeof UpdateAttendanceSchema>;

export type CreateMeetingInput = z.infer<typeof CreateMeetingSchema>;

export type UpdateMeetingInput = z.infer<typeof UpdateMeetingSchema>;

export const PaymentRecordSchema = z.object({
  memberId: ObjectIdSchema,

  contribution: z.coerce.number().min(0),

  loanRepayment: z.coerce.number().min(0),

  absentFine: z.coerce.number().min(0),

  specialLoanFine: z.coerce.number().min(0),

  remarks: z.string().trim().max(500).optional().default(""),
});

export const UpdatePaymentsSchema = z.object({
  payments: z.array(PaymentRecordSchema),
});

export type UpdatePaymentsInput = z.infer<typeof UpdatePaymentsSchema>;

export const BankTransactionRecordSchema = z.object({
  transactionDate: z.coerce.date(),

  type: z.enum(BANK_TRANSACTION_TYPE_VALUES),

  amount: z.coerce.number().min(0),

  remarks: z.string().trim().max(500).optional().default(""),
});

export const UpdateBankTransactionsSchema = z.object({
  bankTransactions: z.array(BankTransactionRecordSchema),
});

export type UpdateBankTransactionsInput = z.infer<typeof UpdateBankTransactionsSchema>;

export const IncomeRecordSchema = z.object({
  transactionDate: z.coerce.date(),

  category: z.enum(INCOME_CATEGORY_VALUES),

  amount: z.coerce.number().min(0),

  remarks: z.string().trim().max(500).optional().default(""),
});

export const UpdateIncomeSchema = z.object({
  otherIncomes: z.array(IncomeRecordSchema),
});

export type UpdateIncomeInput = z.infer<typeof UpdateIncomeSchema>;

export const ExpenseRecordSchema = z.object({
  transactionDate: z.coerce.date(),

  category: z.enum(EXPENSE_CATEGORY_VALUES),

  amount: z.coerce.number().min(0),

  remarks: z.string().trim().max(500).optional().default(""),
});

export const UpdateExpensesSchema = z.object({
  expenses: z.array(ExpenseRecordSchema),
});

export type UpdateExpensesInput = z.infer<typeof UpdateExpensesSchema>;

export const UpdateMeetingSchema = CreateMeetingSchema.partial().extend({
  attendance: AttendanceRecordSchema.array().optional(),

  payments: PaymentRecordSchema.array().optional(),

  bankTransactions: BankTransactionRecordSchema.array().optional(),

  otherIncomes: IncomeRecordSchema.array().optional(),

  expenses: ExpenseRecordSchema.array().optional(),
});
