import connectMongo from "@/lib/db/mongodb";

import User from "@/models/User";

import { hashPassword, verifyPassword } from "@/lib/auth/password";

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
    throw new Error("User not found.");
  }

  // Verify the current password.
  const passwordValid = await verifyPassword(data.currentPassword, user.passwordHash);

  if (!passwordValid) {
    throw new Error("Current password is incorrect.");
  }

  // Prevent reusing the existing password.
  const samePassword = await verifyPassword(data.newPassword, user.passwordHash);

  if (samePassword) {
    throw new Error("New password must be different from the current password.");
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
