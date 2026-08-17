import connectMongo from "@/lib/db/mongodb";
import LoginActivity from "@/models/LoginActivity";
import User from "@/models/User";
import { Types } from "mongoose";

import {
  LOGIN_ACTIVITY_TYPE,
  SESSION_OPEN_COOLDOWN_MS,
  type LoginActivityType,
} from "../domain/login-activity";
import { getLoginActivityRequestContext } from "./internal/request-context";

function asObjectId(userId: string | Types.ObjectId) {
  return userId instanceof Types.ObjectId ? userId : new Types.ObjectId(userId);
}

async function appendActivity({
  username,
  type,
  userId,
  occurredAt,
}: {
  username: string;
  type: LoginActivityType;
  userId?: string | Types.ObjectId | null;
  occurredAt: Date;
}) {
  const context = await getLoginActivityRequestContext();

  await LoginActivity.collection.insertOne({
    userId: userId ? asObjectId(userId) : null,
    username,
    type,
    occurredAt,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    createdAt: occurredAt,
    updatedAt: occurredAt,
    __v: 0,
  });
}

async function bumpUserCounters(
  userId: string | Types.ObjectId,
  type: LoginActivityType,
  occurredAt: Date,
) {
  const set: Record<string, Date> = {
    updatedAt: occurredAt,
  };
  const inc: Record<string, number> = {};

  if (type === LOGIN_ACTIVITY_TYPE.LOGIN_SUCCESS) {
    set.lastLoginAt = occurredAt;
    set.lastSeenAt = occurredAt;
    inc.loginCount = 1;
  } else if (type === LOGIN_ACTIVITY_TYPE.LOGIN_FAILURE) {
    set.lastFailedLoginAt = occurredAt;
    inc.failedLoginCount = 1;
  } else {
    set.lastSeenAt = occurredAt;
    inc.sessionOpenCount = 1;
  }

  await User.collection.updateOne({ _id: asObjectId(userId) }, { $set: set, $inc: inc });
}

export async function recordLoginSuccess(userId: string, username: string) {
  await connectMongo();

  const occurredAt = new Date();

  await bumpUserCounters(userId, LOGIN_ACTIVITY_TYPE.LOGIN_SUCCESS, occurredAt);

  try {
    await appendActivity({
      userId,
      username,
      type: LOGIN_ACTIVITY_TYPE.LOGIN_SUCCESS,
      occurredAt,
    });
  } catch {
    // Keep the login successful even if the activity log insert fails.
  }
}

export async function recordLoginFailure(username: string) {
  await connectMongo();

  const user = await User.collection.findOne(
    { username },
    { projection: { _id: 1, username: 1 } },
  );

  if (!user) {
    return;
  }

  const occurredAt = new Date();

  await bumpUserCounters(user._id, LOGIN_ACTIVITY_TYPE.LOGIN_FAILURE, occurredAt);

  try {
    await appendActivity({
      userId: user._id,
      username: user.username,
      type: LOGIN_ACTIVITY_TYPE.LOGIN_FAILURE,
      occurredAt,
    });
  } catch {
    // Keep the failed-login counter even if the activity log insert fails.
  }
}

export async function recordSessionOpen(userId: string, username: string) {
  await connectMongo();

  const user = await User.collection.findOne(
    { _id: asObjectId(userId) },
    { projection: { _id: 1, username: 1 } },
  );

  if (!user) {
    return { recorded: false };
  }

  const occurredAt = new Date();
  const lastOpen = await LoginActivity.collection.findOne(
    {
      userId: user._id,
      type: LOGIN_ACTIVITY_TYPE.SESSION_OPEN,
    },
    {
      sort: { occurredAt: -1 },
      projection: { occurredAt: 1 },
    },
  );

  const lastOpenAt = lastOpen?.occurredAt ? new Date(lastOpen.occurredAt).getTime() : 0;
  const withinCooldown =
    lastOpenAt > 0 && occurredAt.getTime() - lastOpenAt < SESSION_OPEN_COOLDOWN_MS;

  if (withinCooldown) {
    await User.collection.updateOne(
      { _id: user._id },
      { $set: { lastSeenAt: occurredAt, updatedAt: occurredAt } },
    );
    return { recorded: false };
  }

  await bumpUserCounters(user._id, LOGIN_ACTIVITY_TYPE.SESSION_OPEN, occurredAt);

  try {
    await appendActivity({
      userId: user._id,
      username: username || user.username,
      type: LOGIN_ACTIVITY_TYPE.SESSION_OPEN,
      occurredAt,
    });
  } catch {
    // Keep the app-open counter even if the activity log insert fails.
  }

  return { recorded: true };
}
