import connectMongo from "@/lib/db/mongodb";

import User from "@/models/User";

import { getUser, type UserDetails } from "./get";

/**
 * Deactivate (close) a user account.
 *
 * This marks the user as INACTIVE without
 * deleting the record.
 */
export async function closeUser(
  userId: string,
): Promise<UserDetails> {
  await connectMongo();

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  user.status = "INACTIVE";

  await user.save();

  return getUser(userId);
}