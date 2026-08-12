import { z } from "zod";

import { LOAN_STATUS } from "./domain/loan-status";

import { LOAN_TYPES } from "./domain/loan-type";

/**
 * Shared ObjectId validation.
 */
export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id.");

/**
 * Loan Type validation.
 */
export const LoanTypeSchema = z.enum(LOAN_TYPES);

/**
 * Loan Status validation.
 */
export const LoanStatusSchema = z.enum(LOAN_STATUS);

/**
 * Create Loan
 */
export const CreateLoanSchema = z
  .object({
    financialYearId: ObjectIdSchema,

    memberId: ObjectIdSchema,

    loanType: LoanTypeSchema,

    sanctionedAmount: z.coerce.number().positive("Sanctioned amount must be greater than zero."),

    disbursedAmount: z.coerce.number().positive("Disbursed amount must be greater than zero."),

    interestRate: z.coerce.number().min(0, "Interest rate cannot be negative."),

    expectedMonthlyRepayment: z.coerce
      .number()
      .positive("Minimum monthly repayment must be greater than zero."),

    disbursedDate: z.coerce.date(),

    remarks: z
      .string()
      .trim()
      .max(1000, "Remarks cannot exceed 1000 characters.")
      .optional()
      .default(""),
  })
  .superRefine((data, context) => {
    if (data.disbursedAmount > data.sanctionedAmount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["disbursedAmount"],
        message: "Disbursed amount cannot exceed sanctioned amount.",
      });
    }
  });

export type CreateLoanInput = z.infer<typeof CreateLoanSchema>;

/**
 * Update Loan
 */
export const UpdateLoanSchema = z
  .object({
    loanType: LoanTypeSchema.optional(),

    status: LoanStatusSchema.optional(),

    sanctionedAmount: z.coerce
      .number()
      .positive("Sanctioned amount must be greater than zero.")
      .optional(),

    disbursedAmount: z.coerce
      .number()
      .positive("Disbursed amount must be greater than zero.")
      .optional(),

    interestRate: z.coerce.number().min(0, "Interest rate cannot be negative.").optional(),

    expectedMonthlyRepayment: z.coerce
      .number()
      .positive("Minimum monthly repayment must be greater than zero.")
      .optional(),

    disbursedDate: z.coerce.date().optional(),

    remarks: z.string().trim().max(1000, "Remarks cannot exceed 1000 characters.").optional(),
  })
  .superRefine((data, context) => {
    if (
      data.sanctionedAmount !== undefined &&
      data.disbursedAmount !== undefined &&
      data.disbursedAmount > data.sanctionedAmount
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["disbursedAmount"],
        message: "Disbursed amount cannot exceed sanctioned amount.",
      });
    }

    if (
      data.disbursedAmount !== undefined &&
      data.expectedMonthlyRepayment !== undefined &&
      data.expectedMonthlyRepayment > data.disbursedAmount
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expectedMonthlyRepayment"],
        message: "Minimum monthly repayment cannot exceed the disbursed amount.",
      });
    }
  });

export type UpdateLoanInput = z.infer<typeof UpdateLoanSchema>;

/**
 * Loan Id
 */
export const LoanIdSchema = ObjectIdSchema;

export type LoanIdInput = z.infer<typeof LoanIdSchema>;
