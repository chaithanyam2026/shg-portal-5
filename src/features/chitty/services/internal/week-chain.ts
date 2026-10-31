import { Types } from "mongoose";

import { toDateInputValue } from "@/lib/utils/date";
import ChittyWeek from "@/models/ChittyWeek";

import {
  buildWeekBalanceChain,
  chittyEntryAmount,
  type ChittyStoredEntryAmounts,
  type ChittyWeekBalance,
} from "../../domain";

type StoredEntry = ChittyStoredEntryAmounts & {
  chittyUserId: Types.ObjectId;
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

export function priorUserEntries(
  sundayValues: string[],
  selectedDate: string,
  stored: Map<string, StoredChittyWeek>,
  chittyUserId: string,
): ChittyStoredEntryAmounts[] {
  return sundayValues
    .filter((date) => date < selectedDate)
    .map((date) => {
      const entry = stored
        .get(date)
        ?.entries.find((item) => item.chittyUserId.toString() === chittyUserId);

      return entry ?? {};
    });
}

export function balanceChainForSundays(
  sundayValues: string[],
  stored: Map<string, StoredChittyWeek>,
  weeklyAmount: number,
): ChittyWeekBalance[] {
  return buildWeekBalanceChain(
    sundayValues.map((date) => {
      const week = stored.get(date);
      const collected = (week?.entries ?? []).reduce(
        (sum, entry) => sum + chittyEntryAmount(entry, weeklyAmount),
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
