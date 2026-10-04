import { HydratedDocument, Model, Schema, Types, model, models } from "mongoose";

import { CHITTY_STATUSES, CHITTY_STATUS_VALUES } from "@/features/chitty/domain/chitty-status";
import { createSchemaOptions } from "@/lib/db/schema-options";

export interface ChittyDocument {
  _id: Types.ObjectId;
  name: string;
  code: string;
  startDate: Date;
  status: (typeof CHITTY_STATUS_VALUES)[number];
  createdBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ChittyHydratedDocument = HydratedDocument<ChittyDocument>;

const chittySchema = new Schema<ChittyDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 1,
      maxlength: 20,
    },
    startDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: CHITTY_STATUS_VALUES,
      default: CHITTY_STATUSES.ACTIVE,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  createSchemaOptions(),
);

const Chitty: Model<ChittyDocument> =
  (models.Chitty as Model<ChittyDocument>) ?? model<ChittyDocument>("Chitty", chittySchema);

export default Chitty;
