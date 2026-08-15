import { z } from "zod";

import { LOAN_STATUS } from "./domain/loan-status";

import { LOAN_TYPES, SPECIAL_LOAN_TYPE } from "./domain/loan-type";

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
const CreateLoanFieldsSchema = z.object({
  memberId: ObjectIdSchema,

  loanType: LoanTypeSchema,

  sanctionedAmount: z.coerce.number().positive("Sanctioned amount must be greater than zero."),

  disbursedAmount: z.coerce.number().positive("Disbursed amount must be greater than zero."),

  interestRate: z.coerce.number().min(0, "Interest rate cannot be negative.").default(10),

  sanctionedDate: z.coerce.date(),

  disbursedDate: z.coerce.date(),

  expiryDate: z.coerce.date().nullable().optional(),

  expectedMonthlyRepayment: z.coerce
    .number()
    .min(0, "Minimum monthly repayment cannot be negative.")
    .optional(),

  remarks: z
    .string()
    .trim()
    .max(1000, "Remarks cannot exceed 1000 characters.")
    .optional()
    .default(""),
});

function refineCreateLoanData(
  data: z.infer<typeof CreateLoanFieldsSchema>,
  context: z.RefinementCtx,
): void {
  if (data.disbursedAmount > data.sanctionedAmount) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["disbursedAmount"],
      message: "Disbursed amount cannot exceed sanctioned amount.",
    });
  }

  if (data.disbursedDate.getTime() < data.sanctionedDate.getTime()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["disbursedDate"],
      message: "Start date cannot be before the sanctioned date.",
    });
  }

  if (data.loanType === SPECIAL_LOAN_TYPE && !data.expiryDate) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["expiryDate"],
      message: "Expiry date is required for special loans.",
    });
  }

  if (data.expiryDate && data.expiryDate.getTime() < data.disbursedDate.getTime()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["expiryDate"],
      message: "Expiry date cannot be before the start date.",
    });
  }

  if (
    data.expectedMonthlyRepayment !== undefined &&
    data.expectedMonthlyRepayment > data.disbursedAmount
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["expectedMonthlyRepayment"],
      message: "Minimum monthly repayment cannot exceed the disbursed amount.",
    });
  }
}

export const CreateMeetingLoanSchema = CreateLoanFieldsSchema.superRefine(refineCreateLoanData);

export type CreateMeetingLoanInput = z.infer<typeof CreateMeetingLoanSchema>;

export const CreateLoanSchema = CreateLoanFieldsSchema.extend({
  financialYearId: ObjectIdSchema,

  meetingId: ObjectIdSchema.optional(),
}).superRefine(refineCreateLoanData);

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
      .min(0, "Minimum monthly repayment cannot be negative.")
      .optional(),

    sanctionedDate: z.coerce.date().optional(),

    disbursedDate: z.coerce.date().optional(),

    closedDate: z.coerce.date().nullable().optional(),

    expiryDate: z.coerce.date().nullable().optional(),

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

/**
 * Close Loan
 */
export const CloseLoanSchema = z.object({
  closedDate: z.coerce.date(),
  comment: z
    .string()
    .trim()
    .min(1, "A comment is required to close the loan.")
    .max(1000, "Comment cannot exceed 1000 characters."),
});

export type CloseLoanInput = z.infer<typeof CloseLoanSchema>;
