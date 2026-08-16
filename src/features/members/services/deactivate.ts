import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";

import { USER_STATUS } from "@/lib/constants/user-status";
import { AppError } from "@/lib/errors";

import Member from "@/models/Member";
import User from "@/models/User";

import type { MemberDetails } from "../types";

import { getMember } from "./get";

export async function deactivateMember(memberId: string): Promise<MemberDetails> {
  await connectMongo();

  if (!Types.ObjectId.isValid(memberId)) {
    throw new AppError("Invalid member id.", 400);
  }

  const member = await Member.findById(memberId);

  if (!member) {
    throw new AppError("Member not found.", 404);
  }

  if (!member.active) {
    throw new AppError("Member is already deactivated.", 400);
  }

  member.active = false;
  member.deactivatedDate = new Date();
  await member.save();

  await User.findByIdAndUpdate(member.userId, {
    status: USER_STATUS.INACTIVE,
  });

  const { revalidateMembers } = await import("@/lib/cache");
  revalidateMembers();

  return getMember(memberId);
}
