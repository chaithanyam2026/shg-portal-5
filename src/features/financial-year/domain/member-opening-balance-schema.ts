import { Schema } from "mongoose";

export const MemberOpeningBalanceSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    memberCode: {
      type: String,
      required: true,
      trim: true,
    },

    memberName: {
      type: String,
      required: true,
      trim: true,
    },

    savings: {
      type: Number,
      required: true,
      default: 0,
    },

    loan: {
      type: Number,
      required: true,
      default: 0,
    },

    interest: {
      type: Number,
      required: true,
      default: 0,
    },

    fine: {
      type: Number,
      required: true,
      default: 0,
    },

    other: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: false,
  },
);
