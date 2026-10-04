import { z } from "zod";

import { CHITTY_STATUS_VALUES } from "./domain/chitty-status";

export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id.");

const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date.");

export const ChittyPaymentRecordSchema = z.object({
  chittyUserId: ObjectIdSchema,
  cash: z.coerce.number().min(0, "Cash cannot be negative."),
  gpay: z.coerce.number().min(0, "GPay cannot be negative."),
});

export const SaveChittyPaymentsSchema = z.object({
  chittyId: ObjectIdSchema,
  date: DateSchema,
  records: z.array(ChittyPaymentRecordSchema),
  disbursedAmount: z.coerce.number().min(0, "Disbursed amount cannot be negative.").optional(),
});

export const CloseChittyWeekSchema = z.object({
  chittyId: ObjectIdSchema,
  date: DateSchema,
});

export const CreateChittySchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(150),
  code: z.string().trim().min(1, "Code is required.").max(20),
  startDate: DateSchema,
  status: z.enum(CHITTY_STATUS_VALUES).optional(),
});

export const UpdateChittyStatusSchema = z.object({
  status: z.enum(CHITTY_STATUS_VALUES),
});

export const UpdateChittyWinDateSchema = z.object({
  winDate: DateSchema.nullable(),
});

export type SaveChittyPaymentsInput = z.infer<typeof SaveChittyPaymentsSchema>;
export type CreateChittyInput = z.infer<typeof CreateChittySchema>;
export type UpdateChittyStatusInput = z.infer<typeof UpdateChittyStatusSchema>;
