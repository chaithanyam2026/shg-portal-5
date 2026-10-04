import { Types } from "mongoose";

import { toDateInputValue } from "@/lib/utils/date";
import ChittyWeek from "@/models/ChittyWeek";

import { buildWeekBalanceChain, collectedAmount, type ChittyWeekBalance } from "../../domain";

type StoredEntry = {
  chittyUserId: Types.ObjectId;
  cash: number;
  gpay: number;
};

export type StoredChittyWeek = {
  date: string;
  closed: boolean;
  disbursedAmount: number;
  entries: StoredEntry[];
};

export async function loadStoredWeeks(chittyId: string): Promise<Map<string, StoredChittyWeek>> {
  const weeks = await ChittyWeek.find({ chittyId: new Types.ObjectId(chittyId) }).lean();

  return new Map(
    weeks.map((week) => [
      toDateInputValue(week.date),
      {
        date: toDateInputValue(week.date),
        closed: week.closed,
        disbursedAmount: week.disbursedAmount,
        entries: week.entries,
      },
    ]),
  );
}

export function balanceChainForSundays(
  sundayValues: string[],
  stored: Map<string, StoredChittyWeek>,
): ChittyWeekBalance[] {
  return buildWeekBalanceChain(
    sundayValues.map((date) => {
      const week = stored.get(date);
      const collected = (week?.entries ?? []).reduce(
        (sum, entry) => sum + collectedAmount(entry.cash, entry.gpay),
        0,
      );

      return {
        date,
        collected,
        disbursedAmount: week?.disbursedAmount ?? 0,
        closed: week?.closed ?? false,
      };
    }),
  );
}
