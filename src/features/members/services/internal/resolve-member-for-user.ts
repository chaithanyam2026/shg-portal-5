import connectMongo from "@/lib/db/mongodb";

import Member from "@/models/Member";
import User from "@/models/User";

import { AppError } from "@/lib/errors";

type ResolvedAccountMember = {
  member: {
    _id: { toString(): string };
    memberCode: string;
    name: string;
    phone: string;
    address: string;
  };
};

/**
 * Resolves the member profile for a logged-in user.
 *
 * Supports legacy records where Member.userId is set but User.memberId is missing.
 */
export async function resolveMemberForUser(userId: string): Promise<ResolvedAccountMember> {
  await connectMongo();

  const user = await User.findById(userId).select("memberId");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  let member = user.memberId ? await Member.findById(user.memberId) : null;

  if (!member) {
    member = await Member.findOne({ userId: user._id });

    if (member) {
      user.memberId = member._id;
      await user.save();
    }
  }

  if (!member) {
    throw new AppError("Your account is not linked to a member profile.", 404);
  }

  return { member };
}
