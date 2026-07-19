import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

import { MemberOpeningBalanceSchema, OpeningBalanceSchema } from "@/features/financial-year/domain";

import { schemaOptions } from "@/lib/db/schema-options";

const FinancialYearClosingSchema = new Schema(
  {
    financialYearId: {
      type: Schema.Types.ObjectId,
      ref: "FinancialYear",
      required: true,
      unique: true,
      index: true,
    },

    meetingId: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },

    closedAt: {
      type: Date,
      required: true,
    },

    openingBalances: {
      type: OpeningBalanceSchema,
      required: true,
    },

    memberOpeningBalances: {
      type: [MemberOpeningBalanceSchema],
      required: true,
      default: [],
    },
  },
  schemaOptions,
);

export type FinancialYearClosingDocument = InferSchemaType<typeof FinancialYearClosingSchema> & {
  _id: Types.ObjectId;
};

const FinancialYearClosing: Model<FinancialYearClosingDocument> =
  models.FinancialYearClosing ??
  model<FinancialYearClosingDocument>("FinancialYearClosing", FinancialYearClosingSchema);

export default FinancialYearClosing;
