import connectMongo from "@/lib/db/mongodb";

import Member from "@/models/Member";
import User from "@/models/User";

import { hashPassword } from "@/lib/auth/password";

import { CreateUserInput, CreateUserSchema } from "../validation";
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

export async function createUser(input: CreateUserInput): Promise<UserSummary> {
  await connectMongo();

  const data = CreateUserSchema.parse(input);

  // Ensure username is unique.
  const existingUser = await User.findOne({
    username: data.username,
  })
    .select("_id")
    .lean();

  if (existingUser) {
    throw new Error("Username already exists.");
  }

  // Validate member association, if provided.
  if (data.memberId) {
    const member = await Member.findById(data.memberId).select("_id").lean();

    if (!member) {
      throw new Error("Member not found.");
    }

    const linkedUser = await User.findOne({
      memberId: data.memberId,
    })
      .select("_id")
      .lean();

    if (linkedUser) {
      throw new Error("A user is already linked to this member.");
    }
  }

  // Hash the password before persisting.
  const passwordHash = await hashPassword(data.password);

  const user = await User.create({
    username: data.username,
    passwordHash,
    role: data.role,
    status: data.status,
    memberId: data.memberId ?? null,
  });

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
