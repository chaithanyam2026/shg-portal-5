import { HydratedDocument, Model, Schema, Types, model, models } from "mongoose";

import { createSchemaOptions } from "@/lib/db/schema-options";

export type ChittyWeekEntryDocument = {
  chittyUserId: Types.ObjectId;
  cash: number;
  gpay: number;
};

export interface ChittyWeekDocument {
  _id: Types.ObjectId;
  chittyId: Types.ObjectId;
  date: Date;
  closed: boolean;
  closedAt: Date | null;
  closedBy: Types.ObjectId | null;
  disbursedAmount: number;
  entries: ChittyWeekEntryDocument[];
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ChittyWeekHydratedDocument = HydratedDocument<ChittyWeekDocument>;

const entrySchema = new Schema<ChittyWeekEntryDocument>(
  {
    chittyUserId: {
      type: Schema.Types.ObjectId,
      ref: "ChittyUser",
      required: true,
    },
    cash: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    gpay: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { _id: false },
);

const chittyWeekSchema = new Schema<ChittyWeekDocument>(
  {
    chittyId: {
      type: Schema.Types.ObjectId,
      ref: "Chitty",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    closed: {
      type: Boolean,
      required: true,
      default: false,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    closedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    disbursedAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    entries: {
      type: [entrySchema],
      default: [],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  createSchemaOptions(),
);

chittyWeekSchema.index({ chittyId: 1, date: 1 }, { unique: true });

const ChittyWeek: Model<ChittyWeekDocument> =
  (models.ChittyWeek as Model<ChittyWeekDocument>) ??
  model<ChittyWeekDocument>("ChittyWeek", chittyWeekSchema);

export default ChittyWeek;
