import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";

import Member from "@/models/Member";
import User from "@/models/User";

import { UpdateUserInput, UpdateUserSchema } from "../validation";
import type {
  UserSummary,
} from "../types";

/* export type UserSummary = {
  _id: string;
  username: string;
  role: string;
  status: string;
  memberId: string | null;
  createdAt: string;
  updatedAt: string;
}; */

export async function updateUser(userId: string, input: UpdateUserInput): Promise<UserSummary> {
  await connectMongo();

  const data = UpdateUserSchema.parse(input);

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Ensure the username is unique when it is being changed.
  if (data.username !== undefined && data.username !== user.username) {
    const existingUser = await User.findOne({
      username: data.username,
      _id: { $ne: user._id },
    })
      .select("_id")
      .lean();

    if (existingUser) {
      throw new Error("Username already exists.");
    }
  }

  // Validate member assignment when memberId
  // is included in the update payload.
  if (Object.prototype.hasOwnProperty.call(data, "memberId")) {
    if (data.memberId) {
      const member = await Member.findById(data.memberId).select("_id").lean();

      if (!member) {
        throw new Error("Member not found.");
      }

      const linkedUser = await User.findOne({
        memberId: data.memberId,
        _id: { $ne: user._id },
      })
        .select("_id")
        .lean();

      if (linkedUser) {
        throw new Error("A user is already linked to this member.");
      }
    }
  }

  if (data.username !== undefined) {
    user.username = data.username;
  }

  if (data.role !== undefined) {
    user.role = data.role;
  }

  if (data.status !== undefined) {
    user.status = data.status;
  }

  if (Object.prototype.hasOwnProperty.call(data, "memberId")) {
  user.memberId = data.memberId
    ? new Types.ObjectId(data.memberId)
    : null;
}

  await user.save();

  return {
    _id: user._id.toString(),
    username: user.username,
    role: user.role,
    status: user.status,
    memberId: user.memberId ? user.memberId.toString() : null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
