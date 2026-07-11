import {
  InferSchemaType,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

import { createSchema } from "@/lib/db/schema";

import {
  MEETING_STATUS,
  MEETING_STATUS_VALUES,
} from "@/features/meetings/domain/meeting-status";
import {
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_VALUES,
} from "@/features/meetings/domain/attendance-status";
import {
  WEEKLY_CONTRIBUTION,
} from "@/features/meetings/domain/payment";

import {
  BANK_TRANSACTION_TYPE,
  BANK_TRANSACTION_TYPE_VALUES,
} from "@/features/meetings/domain/bank-transaction";
import {
  INCOME_CATEGORY,
  INCOME_CATEGORY_VALUES,
} from "@/features/meetings/domain/income";
import {
  EXPENSE_CATEGORY,
  EXPENSE_CATEGORY_VALUES,
} from "@/features/meetings/domain/expense";

const incomeSchema = createSchema(
  {
    transactionDate: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      enum: INCOME_CATEGORY_VALUES,
      required: true,
      default:
        INCOME_CATEGORY.MISCELLANEOUS,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  },
);

const expenseSchema = createSchema(
  {
    transactionDate: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      enum: EXPENSE_CATEGORY_VALUES,
      required: true,
      default:
        EXPENSE_CATEGORY.MISCELLANEOUS,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  },
);

const meetingSchema = createSchema({
  financialYearId: {
    type: Schema.Types.ObjectId,
    ref: "FinancialYear",
    required: true,
    index: true,
  },

  meetingDate: {
    type: Date,
    required: true,
    index: true,
  },

  place: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },

  agenda: {
    type: String,
    default: "",
    trim: true,
    maxlength: 1000,
  },

  remarks: {
    type: String,
    default: "",
    trim: true,
    maxlength: 2000,
  },
  attendance: [
    {
      memberId: {
        type: Schema.Types.ObjectId,
        ref: "Member",
        required: true,
      },

      status: {
        type: String,
        enum: ATTENDANCE_STATUS_VALUES,
        default: ATTENDANCE_STATUS.PRESENT,
        required: true,
      },

      remarks: {
        type: String,
        default: "",
        trim: true,
        maxlength: 500,
      },
    },
  ],

  payments: {
    type: [
      {
        memberId: {
          type: Schema.Types.ObjectId,
          ref: "Member",
          required: true,
        },

        contribution: {
          type: Number,
          default: 0,
          min: 0,
          required: true,
        },

        loanRepayment: {
          type: Number,
          default: 0,
          min: 0,
          required: true,
        },

        absentFine: {
          type: Number,
          default: 0,
          min: 0,
          required: true,
        },

        specialLoanFine: {
          type: Number,
          default: 0,
          min: 0,
          required: true,
        },

        remarks: {
          type: String,
          default: "",
          trim: true,
          maxlength: 500,
        },
      },
    ],
    default: [],
  },

  bankTransactions: {
    type: [
      {
        transactionDate: {
          type: Date,
          required: true,
        },

        type: {
          type: String,
          enum:
            BANK_TRANSACTION_TYPE_VALUES,
          required: true,
          default:
            BANK_TRANSACTION_TYPE.DEPOSIT,
        },

        amount: {
          type: Number,
          required: true,
          min: 0,
        },

        remarks: {
          type: String,
          default: "",
          trim: true,
          maxlength: 500,
        },
      },
    ],

    default: [],
  },
  otherIncomes: {
    type: [incomeSchema],
    default: [],
  },

  expenses: {
    type: [expenseSchema],
    default: [],
  },

  status: {
    type: String,
    enum: MEETING_STATUS_VALUES,
    default: MEETING_STATUS.DRAFT,
    required: true,
    index: true,
  },

  startedAt: {
    type: Date,
    default: null,
  },

  approvedAt: {
    type: Date,
    default: null,
  },

  closedAt: {
    type: Date,
    default: null,
  },

  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    default: null,
  },

  updatedBy: {
    type: Types.ObjectId,
    ref: "User",
    default: null,
  },
});



meetingSchema.index(
  {
    financialYearId: 1,
    meetingDate: 1,
  },
  {
    unique: true,
  }
);

meetingSchema.index({
  status: 1,
  meetingDate: -1,
});

meetingSchema.index({
  "attendance.memberId": 1,
});
meetingSchema.index({
  "payments.memberId": 1,
});

meetingSchema.index({
  "bankTransactions.transactionDate":
    1,
});

meetingSchema.index({
  "otherIncomes.transactionDate": 1,
});

meetingSchema.index({
  "expenses.transactionDate": 1,
});

export type MeetingDocument =
  InferSchemaType<typeof meetingSchema> & {
    _id: Types.ObjectId;
  };

const Meeting: Model<MeetingDocument> =
  (models.Meeting as Model<MeetingDocument>) ??
  model<MeetingDocument>("Meeting", meetingSchema);

export default Meeting;

export { Meeting };