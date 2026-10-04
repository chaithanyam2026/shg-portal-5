import { HydratedDocument, Model, Schema, Types, model, models } from "mongoose";

import { createSchemaOptions } from "@/lib/db/schema-options";

export interface ChittyUserDocument {
  _id: Types.ObjectId;
  chittyId: Types.ObjectId;
  name: string;
  phone: string;
  agentMemberId: Types.ObjectId;
  active: boolean;
  winDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ChittyUserHydratedDocument = HydratedDocument<ChittyUserDocument>;

const chittyUserSchema = new Schema<ChittyUserDocument>(
  {
    chittyId: {
      type: Schema.Types.ObjectId,
      ref: "Chitty",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 15,
    },
    agentMemberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    winDate: {
      type: Date,
      default: null,
    },
  },
  createSchemaOptions(),
);

chittyUserSchema.index({ chittyId: 1, name: 1, agentMemberId: 1 }, { unique: true });

const ChittyUser: Model<ChittyUserDocument> =
  (models.ChittyUser as Model<ChittyUserDocument>) ??
  model<ChittyUserDocument>("ChittyUser", chittyUserSchema);

export default ChittyUser;
