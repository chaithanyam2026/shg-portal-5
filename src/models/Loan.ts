import {
  model,
  models,
  Schema,
  type InferSchemaType,
} from "mongoose";

const LoanSchema = new Schema(
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

export type LoanDocument =
  InferSchemaType<typeof LoanSchema>;

const Loan =
  models.Loan ??
  model("Loan", LoanSchema);

export default Loan;