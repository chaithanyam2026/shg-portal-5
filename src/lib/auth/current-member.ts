import { auth } from "@/auth";

import Member from "@/models/Member";
import User from "@/models/User";

export async function getCurrentMemberId(): Promise<string | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  if (session.user.memberId) {
    return session.user.memberId;
  }

  const user = await User.findById(session.user.id).select("memberId").lean();

  if (user?.memberId) {
    return user.memberId.toString();
  }

  const member = await Member.findOne({
    userId: session.user.id,
  })
    .select("_id")
    .lean();

  return member?._id.toString() ?? null;
}
