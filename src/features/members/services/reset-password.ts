import { Types } from "mongoose";
import { ZodError } from "zod";

import { ResetPasswordSchema } from "@/features/auth/validation";
import { requireRole } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { ADMIN_ROLES, canResetUserPassword } from "@/lib/auth/roles";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";

import Member from "@/models/Member";
import User from "@/models/User";

export type ResetMemberPasswordResult = {
  success: boolean;
  message: string;
};

export async function resetMemberPassword(
  memberId: string,
  input: unknown,
): Promise<ResetMemberPasswordResult> {
  await connectMongo();

  const session = await requireRole(ADMIN_ROLES);

  if (!Types.ObjectId.isValid(memberId)) {
    throw new AppError("Invalid member id.", 400);
  }

  let data;

  try {
    data = ResetPasswordSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(error.issues[0]?.message ?? "Invalid password.", 400);
    }

    throw error;
  }

  const member = await Member.findById(memberId).select("userId name").lean();

  if (!member) {
    throw new AppError("Member not found.", 404);
  }

  const user = member.userId
    ? await User.findById(member.userId)
    : await User.findOne({ memberId: member._id });

  if (!user) {
    throw new AppError("This member does not have a login account.", 404);
  }

  if (!canResetUserPassword(session.user.role, user.role)) {
    throw new AppError(
      "Only administrators can reset passwords for members, secretaries, and treasurers.",
      403,
    );
  }

  user.passwordHash = await hashPassword(data.password);
  await user.save();

  return {
    success: true,
    message: "Password reset successfully.",
  };
}
