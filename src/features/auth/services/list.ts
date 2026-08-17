import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";
import { requireRole } from "@/lib/auth/guards";
import { ADMIN_ROLES } from "@/lib/auth/roles";

import { LOGIN_ACTIVITY_TYPE } from "../domain/login-activity";
import LoginActivity from "@/models/LoginActivity";
import User from "@/models/User";

type PopulatedMember = {
  _id: Types.ObjectId;
  memberCode: string;
  name: string;
};

export type UserListItem = {
  _id: string;
  username: string;
  role: string;
  status: string;
  member: {
    _id: string;
    memberCode: string;
    name: string;
  } | null;
  loginCount: number;
  failedLoginCount: number;
  sessionOpenCount: number;
  lastLoginAt: string | null;
  lastFailedLoginAt: string | null;
  lastSeenAt: string | null;
  createdAt: string;
};

export async function listUsers(): Promise<UserListItem[]> {
  await requireRole(ADMIN_ROLES);
  await connectMongo();

  const [users, activityStats] = await Promise.all([
    User.find()
      .populate({
        path: "memberId",
        select: "memberCode name",
      })
      .sort({
        username: 1,
      })
      .lean(),
    LoginActivity.collection
      .aggregate<{
        _id: Types.ObjectId;
        loginCount: number;
        failedLoginCount: number;
        sessionOpenCount: number;
        lastLoginAt: Date | null;
        lastFailedLoginAt: Date | null;
        lastSeenAt: Date | null;
      }>([
        {
          $match: {
            userId: { $ne: null },
          },
        },
        {
          $group: {
            _id: "$userId",
            loginCount: {
              $sum: {
                $cond: [{ $eq: ["$type", LOGIN_ACTIVITY_TYPE.LOGIN_SUCCESS] }, 1, 0],
              },
            },
            failedLoginCount: {
              $sum: {
                $cond: [{ $eq: ["$type", LOGIN_ACTIVITY_TYPE.LOGIN_FAILURE] }, 1, 0],
              },
            },
            sessionOpenCount: {
              $sum: {
                $cond: [{ $eq: ["$type", LOGIN_ACTIVITY_TYPE.SESSION_OPEN] }, 1, 0],
              },
            },
            lastLoginAt: {
              $max: {
                $cond: [{ $eq: ["$type", LOGIN_ACTIVITY_TYPE.LOGIN_SUCCESS] }, "$occurredAt", "$$REMOVE"],
              },
            },
            lastFailedLoginAt: {
              $max: {
                $cond: [{ $eq: ["$type", LOGIN_ACTIVITY_TYPE.LOGIN_FAILURE] }, "$occurredAt", "$$REMOVE"],
              },
            },
            lastSeenAt: {
              $max: "$occurredAt",
            },
          },
        },
      ])
      .toArray(),
  ]);

  const statsByUserId = new Map(
    activityStats.map((stats) => [stats._id.toString(), stats]),
  );

  return users.map((user) => {
    const member = user.memberId as PopulatedMember | null;
    const stats = statsByUserId.get(user._id.toString());

    return {
      _id: user._id.toString(),

      username: String(user.username),

      role: String(user.role),

      status: String(user.status),

      member: member
        ? {
            _id: member._id.toString(),

            memberCode: member.memberCode,

            name: member.name,
          }
        : null,

      loginCount: Math.max(stats?.loginCount ?? 0, user.loginCount ?? 0),

      failedLoginCount: Math.max(stats?.failedLoginCount ?? 0, user.failedLoginCount ?? 0),

      sessionOpenCount: Math.max(stats?.sessionOpenCount ?? 0, user.sessionOpenCount ?? 0),

      lastLoginAt: (stats?.lastLoginAt ?? user.lastLoginAt)?.toISOString() ?? null,

      lastFailedLoginAt: (stats?.lastFailedLoginAt ?? user.lastFailedLoginAt)?.toISOString() ?? null,

      lastSeenAt: (stats?.lastSeenAt ?? user.lastSeenAt)?.toISOString() ?? null,

      createdAt: user.createdAt.toISOString(),
    };
  });
}