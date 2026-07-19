import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";

import User from "@/models/User";

type PopulatedMember = {
  _id: Types.ObjectId;
  memberCode: string;
  name: string;
};

export type UserDetails = {
  _id: string;
  username: string;
  role: string;
  status: string;
  member: {
    _id: string;
    memberCode: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export async function getUser(
  userId: string,
): Promise<UserDetails> {
  await connectMongo();

  const user = await User.findById(userId).populate({
    path: "memberId",
    select: "memberCode name",
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const member =
    user.memberId as PopulatedMember | null;

  return {
    _id: user._id.toString(),

    username: String(user.username),

    role: String(user.role),

    status: String(user.status),

    member: member
      ? {
          _id: member._id.toString(),

          memberCode: member.memberCode,

          name: member.name,
        }
      : null,

    createdAt:
      user.createdAt.toISOString(),

    updatedAt:
      user.updatedAt.toISOString(),
  };
}