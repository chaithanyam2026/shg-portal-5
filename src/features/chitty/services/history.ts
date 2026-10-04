import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import Chitty from "@/models/Chitty";

import { toSundayDateValues } from "../domain";
import type { ChittyHistoryRow } from "../types";
import { ObjectIdSchema } from "../validation";

import { assertCanAccessChitty } from "./assert-can-access";
import { parseInput } from "./internal/parse";
import { balanceChainForSundays, loadStoredWeeks } from "./internal/week-chain";

export async function getChittyHistory(chittyId: string): Promise<ChittyHistoryRow[]> {
  await assertCanAccessChitty();
  await connectMongo();

  const id = parseInput(ObjectIdSchema, chittyId);
  const scheme = await Chitty.findById(id).select("startDate").lean();

  if (!scheme) {
    throw new AppError("Chitty not found.", 404);
  }

  const dateOptions = toSundayDateValues(scheme.startDate, new Date());
  const stored = await loadStoredWeeks(id);

  return balanceChainForSundays(dateOptions, stored).map((row) => ({
    date: row.date,
    collected: row.collected,
    previousPending: row.previousPending,
    collection: row.collection,
    disbursedAmount: row.disbursedAmount,
    balance: row.balance,
    closed: row.closed,
  }));
}
