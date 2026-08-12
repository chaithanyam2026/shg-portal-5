import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

import { MemberOpeningBalanceSchema, OpeningBalanceSchema } from "@/features/financial-year/domain";

import { createSchemaOptions } from "@/lib/db/schema-options";

const FinancialYearClosingSchema =
  new Schema<FinancialYearClosingDocument>(
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
    createSchemaOptions()
  );

export interface FinancialYearClosingDocument {
  _id: Types.ObjectId;

  financialYearId: Types.ObjectId;

  meetingId: Types.ObjectId;

  closedAt: Date;

  openingBalances: {
    bankBalance: number;
    cashInHand: number;
    excessCorpus: number;
    investments: number;
    otherLoans: number;
  };

  memberOpeningBalances: {
    memberId: Types.ObjectId;
    memberCode: string;
    memberName: string;
    savings: number;
    loan: number;
    interest: number;
    fine: number;
    other: number;
  }[];

  createdAt: Date;

  updatedAt: Date;
}

export type FinancialYearClosingHydratedDocument =
  HydratedDocument<FinancialYearClosingDocument>;

const FinancialYearClosing: Model<FinancialYearClosingDocument> =
  (models.FinancialYearClosing as Model<FinancialYearClosingDocument>) ??
  model<FinancialYearClosingDocument>(
    "FinancialYearClosing",
    FinancialYearClosingSchema,
  );

export default FinancialYearClosing;
