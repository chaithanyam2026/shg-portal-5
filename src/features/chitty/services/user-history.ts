import { auth } from "@/auth";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import { parseDateInputValue } from "@/lib/utils/date";
import Chitty from "@/models/Chitty";
import ChittyUser from "@/models/ChittyUser";

import {
  canRecordChittyWin,
  canViewAllChittyRows,
  collectedAmount,
  resolveChittyEditorRole,
  roundMoney,
  toSundayDateValues,
} from "../domain";
import type { ChittyUserHistory, ChittyUserHistoryGroup } from "../types";
import { ObjectIdSchema, UpdateChittyWinDateSchema } from "../validation";

import { assertCanAccessChitty } from "./assert-can-access";
import { loadChittySubscribers } from "./internal/load-subscribers";
import { parseInput } from "./internal/parse";
import { loadStoredWeeks } from "./internal/week-chain";

export async function getChittyUserHistory(chittyId: string): Promise<ChittyUserHistory> {
  await assertCanAccessChitty();
  await connectMongo();

  const id = parseInput(ObjectIdSchema, chittyId);
  const scheme = await Chitty.findById(id).select("startDate status").lean();

  if (!scheme) {
    throw new AppError("Chitty not found.", 404);
  }

  const session = await auth();
  const role = resolveChittyEditorRole(session?.user.role);
  const currentMemberId = await getCurrentMemberId();
  const canViewAll = canViewAllChittyRows(role);
  const dates = toSundayDateValues(scheme.startDate, new Date());
  const [subscribers, stored] = await Promise.all([loadChittySubscribers(id), loadStoredWeeks(id)]);

  const amountByUserAndDate = new Map<string, number>();

  for (const week of stored.values()) {
    for (const entry of week.entries) {
      const amount = collectedAmount(entry.cash, entry.gpay);

      if (amount <= 0) {
        continue;
      }

      amountByUserAndDate.set(`${entry.chittyUserId.toString()}:${week.date}`, roundMoney(amount));
    }
  }

  const groups = new Map<string, ChittyUserHistoryGroup>();

  for (const subscriber of subscribers) {
    if (!canViewAll && subscriber.agentMemberId !== currentMemberId) {
      continue;
    }

    const payments = dates.map((date) => ({
      date,
      amount: amountByUserAndDate.get(`${subscriber.chittyUserId}:${date}`) ?? null,
    }));
    const group = groups.get(subscriber.agentMemberId) ?? {
      agentMemberId: subscriber.agentMemberId,
      agentMemberName: subscriber.agentMemberName,
      users: [],
    };

    group.users.push({
      chittyUserId: subscriber.chittyUserId,
      userName: subscriber.userName,
      payments,
      pendingCount: payments.filter((payment) => payment.amount === null).length,
      winDate: subscriber.winDate,
    });
    groups.set(subscriber.agentMemberId, group);
  }

  return {
    dates,
    canRecordWin: canRecordChittyWin(role, scheme.status === "CLOSED"),
    groups: [...groups.values()],
  };
}

export async function updateChittyWinDate(chittyUserId: string, input: unknown) {
  await assertCanAccessChitty();
  await connectMongo();

  const id = parseInput(ObjectIdSchema, chittyUserId);
  const data = parseInput(UpdateChittyWinDateSchema, input);
  const user = await ChittyUser.findById(id);

  if (!user) {
    throw new AppError("Chitty user not found.", 404);
  }

  const scheme = await Chitty.findById(user.chittyId).select("status").lean();

  if (!scheme) {
    throw new AppError("Chitty not found.", 404);
  }

  const session = await auth();
  const role = resolveChittyEditorRole(session?.user.role);

  if (!canRecordChittyWin(role, scheme.status === "CLOSED")) {
    throw new AppError("You cannot record a chitty win date.", 403);
  }

  user.winDate = data.winDate ? parseDateInputValue(data.winDate) : null;
  await user.save();

  return {
    chittyUserId: user._id.toString(),
    winDate: data.winDate,
  };
}
