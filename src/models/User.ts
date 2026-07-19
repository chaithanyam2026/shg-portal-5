import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

import { createSchema } from "@/lib/db/schema";

import {
  USER_ROLES,
  USER_ROLE_VALUES,
} from "@/lib/constants/roles";

import {
  USER_STATUS,
  USER_STATUS_VALUES,
} from "@/lib/constants/user-status";

/**
 * User document shape.
 *
 * This interface represents the values stored
 * in MongoDB and is used throughout the application.
 */
export interface UserDocument {
  _id: Types.ObjectId;

  username: string;

  passwordHash: string;

  role: string;

  status: string;

  memberId: Types.ObjectId | null;

  lastLoginAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type UserHydratedDocument =
  HydratedDocument<UserDocument>;

/**
 * Authentication User
 *
 * Stores authentication and authorization
 * information only.
 *
 * Member profile information belongs to
 * the Member collection.
 */
const userSchema =
  createSchema<UserDocument>({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
    },

    passwordHash: {
      type: String,
      required: true,
      minlength: 60,
      maxlength: 255,
    },

    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: USER_ROLES.MEMBER,
      required: true,
    },

    status: {
      type: String,
      enum: USER_STATUS_VALUES,
      default: USER_STATUS.ACTIVE,
      required: true,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  });

/**
 * Indexes
 */
userSchema.index(
  {
    username: 1,
  },
  {
    unique: true,
  },
);

userSchema.index({
  memberId: 1,
});

userSchema.index({
  role: 1,
});

userSchema.index({
  status: 1,
});

/**
 * User model
 *
 * Reuses the compiled model during
 * Next.js Fast Refresh.
 */
const User: Model<UserDocument> =
  (models.User as Model<UserDocument>) ??
  model<UserDocument>(
    "User",
    userSchema,
  );

export default User;

export { User };