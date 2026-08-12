import { Schema } from "mongoose";

export const OpeningBalanceSchema = new Schema(
  {
    bankBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    cashInHand: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    excessCorpus: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    investments: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    otherLoans: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  },
);
