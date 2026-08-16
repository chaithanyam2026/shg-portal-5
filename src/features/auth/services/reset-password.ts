import { Types } from "mongoose";
import { ZodError } from "zod";

import { requireRole } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { ADMIN_ROLES, canResetUserPassword } from "@/lib/auth/roles";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";

import User from "@/models/User";

import { ResetPasswordSchema } from "../validation";

export type ResetPasswordResult = {
  success: boolean;
  message: string;
};

export async function resetPassword(
  userId: string,
  input: unknown,
): Promise<ResetPasswordResult> {
  await connectMongo();

  const session = await requireRole(ADMIN_ROLES);

  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user id.", 400);
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

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
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
