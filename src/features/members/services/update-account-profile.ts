import connectMongo from "@/lib/db/mongodb";

import Member from "@/models/Member";

import { AppError } from "@/lib/errors";

import type { AccountProfile } from "../types";

import { UpdateMemberProfileInput, UpdateMemberProfileSchema } from "../validation";

import { resolveMemberForUser } from "./internal/resolve-member-for-user";

export type UpdateAccountProfileResult = {
  success: boolean;
  message: string;
  profile: AccountProfile;
};

export async function updateAccountProfile(
  userId: string,
  input: UpdateMemberProfileInput,
): Promise<UpdateAccountProfileResult> {
  await connectMongo();

  const data = UpdateMemberProfileSchema.parse(input);
  const { member: resolvedMember } = await resolveMemberForUser(userId);

  const member = await Member.findById(resolvedMember._id);

  if (!member) {
    throw new AppError("Member profile not found.", 404);
  }

  const phoneInUse = await Member.exists({
    _id: {
      $ne: member._id,
    },
    phone: data.phone,
  });

  if (phoneInUse) {
    throw new AppError("Phone number is already used by another member.", 409);
  }

  member.name = data.name;
  member.phone = data.phone;
  member.address = data.address;

  await member.save();

  return {
    success: true,
    message: "Profile updated successfully.",
    profile: {
      memberId: member._id.toString(),
      memberCode: member.memberCode,
      name: member.name,
      phone: member.phone,
      address: member.address ?? "",
    },
  };
}
