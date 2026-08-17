import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import { requireRole } from "@/lib/auth/guards";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import LoginActivity from "@/models/LoginActivity";
import User from "@/models/User";

import { LOGIN_ACTIVITY_TYPE_LABELS, type LoginActivityType } from "../domain/login-activity";

export type LoginActivityItem = {
  id: string;
  type: LoginActivityType;
  typeLabel: string;
  occurredAt: string;
  ipAddress: string;
  userAgent: string;
};

export type UserLoginActivitySummary = {
  userId: string;
  username: string;
  loginCount: number;
  failedLoginCount: number;
  sessionOpenCount: number;
  lastLoginAt: string | null;
  lastFailedLoginAt: string | null;
  lastSeenAt: string | null;
  items: LoginActivityItem[];
};

export async function listLoginActivity(userId: string): Promise<UserLoginActivitySummary> {
  await requireRole(ADMIN_ROLES);
  await connectMongo();

  const user = await User.findById(userId)
    .select(
      "username loginCount failedLoginCount sessionOpenCount lastLoginAt lastFailedLoginAt lastSeenAt",
    )
    .lean();

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const activities = await LoginActivity.find({ userId })
    .sort({ occurredAt: -1 })
    .limit(100)
    .lean();

  return {
    userId: user._id.toString(),
    username: user.username,
    loginCount: user.loginCount ?? 0,
    failedLoginCount: user.failedLoginCount ?? 0,
    sessionOpenCount: user.sessionOpenCount ?? 0,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    lastFailedLoginAt: user.lastFailedLoginAt?.toISOString() ?? null,
    lastSeenAt: user.lastSeenAt?.toISOString() ?? null,
    items: activities.map((activity) => ({
      id: activity._id.toString(),
      type: activity.type,
      typeLabel: LOGIN_ACTIVITY_TYPE_LABELS[activity.type],
      occurredAt: activity.occurredAt.toISOString(),
      ipAddress: activity.ipAddress ?? "",
      userAgent: activity.userAgent ?? "",
    })),
  };
}
