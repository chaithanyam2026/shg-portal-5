import { z } from "zod";

export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id.");

export const ReportDateSchema = z.coerce.date();

export const IncomeExpenseReportSchema = z
  .object({
    financialYearId: ObjectIdSchema,

    fromDate: ReportDateSchema.optional(),

    toDate: ReportDateSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.fromDate && value.toDate && value.fromDate > value.toDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toDate"],
        message: "To date must be after from date.",
      });
    }
  });

export type IncomeExpenseReportInput = z.infer<typeof IncomeExpenseReportSchema>;
