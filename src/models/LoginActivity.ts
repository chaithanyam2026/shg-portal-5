import { HydratedDocument, Model, Schema, Types, model, models } from "mongoose";

import {
  LOGIN_ACTIVITY_TYPE_VALUES,
  type LoginActivityType,
} from "@/features/auth/domain/login-activity";
import { createSchemaOptions } from "@/lib/db/schema-options";

export interface LoginActivityDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId | null;
  username: string;
  type: LoginActivityType;
  occurredAt: Date;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LoginActivityHydratedDocument = HydratedDocument<LoginActivityDocument>;

const loginActivitySchema = new Schema<LoginActivityDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    type: {
      type: String,
      enum: LOGIN_ACTIVITY_TYPE_VALUES,
      required: true,
    },

    occurredAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    ipAddress: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    userAgent: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  createSchemaOptions(),
);

loginActivitySchema.index({
  userId: 1,
  occurredAt: -1,
});

loginActivitySchema.index({
  occurredAt: -1,
});

const LoginActivity: Model<LoginActivityDocument> =
  (models.LoginActivity as Model<LoginActivityDocument>) ??
  model<LoginActivityDocument>("LoginActivity", loginActivitySchema);

export default LoginActivity;
