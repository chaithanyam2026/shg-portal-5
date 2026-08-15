import connectMongo from "@/lib/db/mongodb";

import User from "@/models/User";

import { getUser, type UserDetails } from "./get";

export async function activateUser(userId: string): Promise<UserDetails> {
  await connectMongo();

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  user.status = "ACTIVE";

  await user.save();

  return getUser(userId);
}
