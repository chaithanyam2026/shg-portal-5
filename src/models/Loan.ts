import { HydratedDocument, Model, Schema, Types, model, models } from "mongoose";
import type { LoanType } from "@/features/loans/domain";

import type { LoanStatus } from "@/features/loans/domain";


export interface LoanDocument {
  _id: Types.ObjectId;

  financialYearId: Types.ObjectId;

  memberId: Types.ObjectId;

  loanNumber: string;

  sequenceNumber: number;

  loanType: LoanType;

status: LoanStatus;

  sanctionedAmount: number;

  disbursedAmount: number;

  interestRate: number;

  expectedMonthlyRepayment: number;

  disbursedDate: Date;

  expiryDate: Date | null;

  remarks: string;

  createdAt: Date;

  updatedAt: Date;
}

export type LoanHydratedDocument =
  HydratedDocument<LoanDocument>;

const LoanSchema = new Schema<LoanDocument>(
  {
    financialYearId: {
      type: Schema.Types.ObjectId,
      ref: "FinancialYear",
      required: true,
      index: true,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },

    loanNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    sequenceNumber: {
      type: Number,
      required: true,
    },

    loanType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      default: "ACTIVE",
    },

    sanctionedAmount: {
      type: Number,
      required: true,
    },

    disbursedAmount: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      required: true,
    },

    expectedMonthlyRepayment: {
      type: Number,
      required: true,
    },

    disbursedDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

LoanSchema.index({
  financialYearId: 1,
  sequenceNumber: 1,
});

LoanSchema.index({
  memberId: 1,
  status: 1,
});

export const Loan: Model<LoanDocument> =
  (models.Loan as Model<LoanDocument>) ??
  model<LoanDocument>("Loan", LoanSchema);

export default Loan;
