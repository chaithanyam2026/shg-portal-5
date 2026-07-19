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

export type FinancialYearStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "VALIDATED"
  | "APPROVED"
  | "CLOSED";

export interface FinancialYearClosingSummary {
  bankBalance: number;
  cashInHand: number;
  excessCorpus: number;
  investments: number;
  //otherLoans: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface FinancialYearClosingMember {
  memberId: Types.ObjectId;

  memberCode: string;
  memberName: string;

  savingsBalance: number;

  loanOutstanding: number;
  specialLoanOutstanding: number;

  attendanceFineOutstanding: number;
  loanFineOutstanding: number;

  totalOutstanding: number;
}

export interface FinancialYearClosing {
  closedAt: Date;
  closedBy: Types.ObjectId;

  summary: FinancialYearClosingSummary;

  members: FinancialYearClosingMember[];
}

export interface FinancialYearMemberOpening {
  contribution: number;
  loan: number;
  specialLoan: number;
  specialLoanExpiry: Date | null;
}

export interface FinancialYearMember {
  memberId: Types.ObjectId;

  opening: FinancialYearMemberOpening;
}

export interface ExecutiveCommittee {
  president: Types.ObjectId | null;
  vicePresident: Types.ObjectId | null;
  secretary: Types.ObjectId | null;
  jointSecretary: Types.ObjectId | null;
  treasurer: Types.ObjectId | null;
}

export interface OpeningBalance {
  bankBalance: number;
  cashInHand: number;
  excessCorpus: number;
  investments: number;
  otherLoans: number;
}

export interface MemberOpeningBalance {
  memberId: Types.ObjectId;
  memberCode: string;
  memberName: string;

  savings: number;
  loan: number;
  interest: number;
  fine: number;
  other: number;
}

export interface FinancialYearDocument {
  _id: Types.ObjectId;

  name: string;

  startDate: Date;
  endDate: Date;

  remarks: string;

  status: FinancialYearStatus;

  sourceFinancialYearId: Types.ObjectId | null;

  closing: FinancialYearClosing | null;

  members: FinancialYearMember[];

  executiveCommittee: ExecutiveCommittee;

  openingBalances: OpeningBalance | null;

  memberOpeningBalances: MemberOpeningBalance[];

  createdAt: Date;
  updatedAt: Date;
}

export type FinancialYearHydratedDocument =
  HydratedDocument<FinancialYearDocument>;


const financialYearSchema =
  new Schema<FinancialYearDocument>(
    {
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
        enum: ["DRAFT", "IN_PROGRESS", "VALIDATED", "APPROVED", "CLOSED"],
        default: "DRAFT",
        index: true,
      },

      sourceFinancialYearId: {
        type: Schema.Types.ObjectId,
        ref: "FinancialYear",
        default: null,
      },

      closing: {
        type: {
          closedAt: {
            type: Date,
            required: true,
          },

          closedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          summary: {
            bankBalance: {
              type: Number,
              default: 0,
            },

            cashInHand: {
              type: Number,
              default: 0,
            },

            excessCorpus: {
              type: Number,
              default: 0,
            },

            investments: {
              type: Number,
              default: 0,
            },

            otherLoans: {
              type: Number,
              default: 0,
            },

            totalAssets: {
              type: Number,
              default: 0,
            },

            totalLiabilities: {
              type: Number,
              default: 0,
            },
          },

          members: [
            {
              memberId: {
                type: Schema.Types.ObjectId,
                ref: "Member",
                required: true,
              },

              /* savings: {
                type: Number,
                default: 0,
              }, */

              loanOutstanding: {
                type: Number,
                default: 0,
              },

              specialLoanOutstanding: {
                type: Number,
                default: 0,
              },

              /* specialLoanExpiry: {
                type: Date,
                default: null,
              }, */

              /* attendanceFine: {
                type: Number,
                default: 0,
              }, */

              /*  loanFine: {
                 type: Number,
                 default: 0,
               }, */

              totalOutstanding: {
                type: Number,
                default: 0,
              },
            },
          ],
        },

        default: null,
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
        type: OpeningBalanceSchema,
        default: null,
      },

      memberOpeningBalances: {
        type: [MemberOpeningBalanceSchema],
        default: [],
      },

    }, createSchemaOptions(),);

/**
 * Indexes
 */

financialYearSchema.index({ name: 1 }, { unique: true });

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

financialYearSchema.index({
  sourceFinancialYearId: 1,
});

/**
 * Model
 */

const FinancialYear: Model<FinancialYearDocument> =
  (models.FinancialYear as Model<FinancialYearDocument>) ??
  model<FinancialYearDocument>("FinancialYear", financialYearSchema);

export default FinancialYear;

export { FinancialYear };