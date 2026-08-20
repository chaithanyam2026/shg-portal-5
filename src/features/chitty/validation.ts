import { z } from "zod";

export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id.");

export const ChittyPaymentRecordSchema = z.object({
  memberId: ObjectIdSchema,
  cash: z.coerce.number().min(0),
  gpay: z.coerce.number().min(0),
  gpayChecked: z.boolean().optional().default(false),
  missingCount: z.coerce.number().int().min(0),
  remarks: z.string().trim().max(500).optional().default(""),
});

export const SaveChittyPaymentsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date."),
  records: z.array(ChittyPaymentRecordSchema),
});

export type SaveChittyPaymentsInput = z.infer<typeof SaveChittyPaymentsSchema>;
