// import { Types } from "mongoose";
import { z } from "zod";

/**
 * Financial Year Status
 */
export const FinancialYearStatusSchema = z.enum([
  "DRAFT",
  "IN_PROGRESS",
  "VALIDATED",
  "APPROVED",
  "CLOSED",
]);

/**
 * Mongo ObjectId
 */
const ObjectIdSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid id.",
  );

/**
 * Create Financial Year
 */
export const CreateFinancialYearSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(100),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    remarks: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .default(""),
  })
  .superRefine((value, ctx) => {
    if (value.startDate >= value.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message:
          "End date must be after start date.",
      });
    }
  });

/**
 * Update Financial Year
 */
export const UpdateFinancialYearSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

    remarks: z
      .string()
      .trim()
      .max(1000)
      .optional(),

members: z
  .array(
    z.object({
      memberId: ObjectIdSchema,

      openingContribution: z.coerce
        .number()
        .min(0),

      openingLoan: z.coerce
        .number()
        .min(0),

      openingSpecialLoan: z.coerce
        .number()
        .min(0),

      specialLoanExpiry: z
        .union([
          z.coerce.date(),
          z.null(),
        ])
        .optional(),
    }),
  )
  .optional(),

    executiveCommittee: z
      .object({
        president: ObjectIdSchema
          .nullable()
          .optional(),

        vicePresident: ObjectIdSchema
          .nullable()
          .optional(),

        secretary: ObjectIdSchema
          .nullable()
          .optional(),

        jointSecretary: ObjectIdSchema
          .nullable()
          .optional(),

        treasurer: ObjectIdSchema
          .nullable()
          .optional(),
      })
      .optional(),

    openingBalances: z
      .object({
        bankBalance: z
          .coerce
          .number()
          .min(0),

        cashInHand: z
          .coerce
          .number()
          .min(0),

        excessCorpus: z
          .coerce
          .number()
          .min(0),

        investments: z
          .coerce
          .number()
          .min(0),

        otherLoans: z
          .coerce
          .number()
          .min(0),
      })
      .optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.startDate &&
      value.endDate &&
      value.startDate >= value.endDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message:
          "End date must be after start date.",
      });
    }
  });

/**
 * Route Parameter
 */
export const FinancialYearIdSchema =
  z.object({
    id: ObjectIdSchema,
  });

/**
 * Types
 */
export type CreateFinancialYearInput =
  z.infer<
    typeof CreateFinancialYearSchema
  >;

export type UpdateFinancialYearInput =
  z.infer<
    typeof UpdateFinancialYearSchema
  >;

export type FinancialYearIdInput =
  z.infer<
    typeof FinancialYearIdSchema
  >;

export type FinancialYearStatus =
  z.infer<
    typeof FinancialYearStatusSchema
  >;

/**
 * Validation helpers
 */
export function validateCreateFinancialYear(
  input: unknown,
): CreateFinancialYearInput {
  return CreateFinancialYearSchema.parse(
    input,
  );
}

export function validateUpdateFinancialYear(
  input: unknown,
): UpdateFinancialYearInput {
  return UpdateFinancialYearSchema.parse(
    input,
  );
}

export function validateFinancialYearId(
  input: unknown,
): FinancialYearIdInput {
  return FinancialYearIdSchema.parse(
    input,
  );
}