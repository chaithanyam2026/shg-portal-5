import connectMongo from "@/lib/db/mongodb";

import User from "@/models/User";

import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { AppError } from "@/lib/errors";

import { ChangePasswordInput, ChangePasswordSchema } from "../validation";

export type ChangePasswordResult = {
  success: boolean;
  message: string;
};

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
): Promise<ChangePasswordResult> {
  await connectMongo();

  const data = ChangePasswordSchema.parse(input);

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const passwordValid = await verifyPassword(data.currentPassword, user.passwordHash);

  if (!passwordValid) {
    throw new AppError("Current password is incorrect.", 400);
  }

  const samePassword = await verifyPassword(data.newPassword, user.passwordHash);

  if (samePassword) {
    throw new AppError("New password must be different from the current password.", 400);
  }

  // Hash the new password.
  const passwordHash = await hashPassword(data.newPassword);

  // Persist the updated password.
  user.passwordHash = passwordHash;

  await user.save();

  return {
    success: true,
    message: "Password changed successfully.",
  };
}
