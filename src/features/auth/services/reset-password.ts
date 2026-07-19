import connectMongo from "@/lib/db/mongodb";

import User from "@/models/User";

import { hashPassword } from "@/lib/auth/password";

import { ResetPasswordInput, ResetPasswordSchema } from "../validation";

export type ResetPasswordResult = {
  success: boolean;
  message: string;
};

export async function resetPassword(
  userId: string,
  input: ResetPasswordInput,
): Promise<ResetPasswordResult> {
  await connectMongo();

  const data = ResetPasswordSchema.parse(input);

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Hash the new password.
  const passwordHash = await hashPassword(data.password);

  // Persist the updated password.
  user.passwordHash = passwordHash;

  await user.save();

  return {
    success: true,
    message: "Password reset successfully.",
  };
}
