import {
  InferSchemaType,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

import { createSchema } from "@/lib/db/schema";

const financialYearSchema = createSchema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  remarks: {
    type: String,
    default: "",
    trim: true,
    maxlength: 1000,
  },

  status: {
    type: String,
    enum: [
      "DRAFT",
      "IN_PROGRESS",
      "VALIDATED",
      "APPROVED",
      "CLOSED",
    ],
    default: "DRAFT",
    index: true,
  },

  members: [
    {
      memberId: {
        type: Schema.Types.ObjectId,
        ref: "Member",
        required: true,
      },

      opening: {
        contribution: {
          type: Number,
          default: 0,
          min: 0,
        },

        loan: {
          type: Number,
          default: 0,
          min: 0,
        },

        specialLoan: {
          type: Number,
          default: 0,
          min: 0,
        },

        specialLoanExpiry: {
          type: Date,
          default: null,
        },
      },
    },
  ],

  executiveCommittee: {
    president: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },

    vicePresident: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },

    secretary: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },

    jointSecretary: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },

    treasurer: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },
  },

  openingBalances: {
    bankBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    cashInHand: {
      type: Number,
      default: 0,
      min: 0,
    },

    excessCorpus: {
      type: Number,
      default: 0,
      min: 0,
    },

    investments: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherLoans: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
});

/**
 * Indexes
 */

financialYearSchema.index(
  { name: 1 },
  { unique: true },
);

financialYearSchema.index({
  startDate: 1,
  endDate: 1,
});

financialYearSchema.index({
  status: 1,
});

financialYearSchema.index(
  { status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "IN_PROGRESS",
    },
  },
);

/**
 * Document type
 */

export type FinancialYearDocument =
  InferSchemaType<typeof financialYearSchema> & {
    _id: Types.ObjectId;
  };

export type FinancialYearStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "VALIDATED"
  | "APPROVED"
  | "CLOSED";

/**
 * Model
 */

const FinancialYear: Model<FinancialYearDocument> =
  (models.FinancialYear as Model<FinancialYearDocument>) ??
  model<FinancialYearDocument>(
    "FinancialYear",
    financialYearSchema,
  );

export default FinancialYear;

export { FinancialYear };