import { Types } from "mongoose";

import { auth } from "@/auth";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import { parseDateInputValue, toDateInputValue } from "@/lib/utils/date";
import Chitty from "@/models/Chitty";
import ChittyWeek from "@/models/ChittyWeek";

import {
  canEditChittyPaymentRow,
  collectedAmount,
  isSunday,
  resolveChittyEditorRole,
  resolveDefaultSundayDate,
  roundMoney,
  toSundayDateValues,
} from "../domain";
import type { ChittyAgentSummary, ChittyPaymentRecord, ChittyPaymentView } from "../types";
import { CloseChittyWeekSchema, SaveChittyPaymentsSchema } from "../validation";

import { assertCanAccessChitty } from "./assert-can-access";
import { loadChittySubscribers, type ChittySubscriber } from "./internal/load-subscribers";
import { parseInput } from "./internal/parse";
import { sheetPermissions } from "./internal/permissions";
import { defaultChittyId } from "./internal/scheme-order";
import { balanceChainForSundays, loadStoredWeeks } from "./internal/week-chain";
import { listChittySchemes } from "./schemes";

type EditorContext = {
  role: ReturnType<typeof resolveChittyEditorRole>;
  currentMemberId: string | null;
  userId: string;
};

async function loadEditor(): Promise<EditorContext> {
  const session = await auth();

  return {
    role: resolveChittyEditorRole(session?.user.role),
    currentMemberId: await getCurrentMemberId(),
    userId: session?.user.id ?? "",
  };
}

function emptyView(
  editor: EditorContext,
  schemes: ChittyPaymentView["schemes"],
): ChittyPaymentView {
  return {
    chittyId: "",
    chittyName: "",
    chittyStatus: "ACTIVE",
    schemes,
    date: toDateInputValue(new Date()),
    dateOptions: [],
    dayClosed: false,
    schemeClosed: false,
    editorRole: editor.role,
    canEditPayments: false,
    canEditAll: false,
    canEditDisbursement: false,
    canCloseDay: false,
    blockReason: schemes.length === 0 ? "Create a chitty before recording payments." : null,
    currentMemberId: editor.currentMemberId,
    records: [],
    summaries: [],
    grandTotal: 0,
    settlement: null,
  };
}

function buildSummaries(records: ChittyPaymentRecord[]): ChittyAgentSummary[] {
  const grouped = new Map<string, ChittyAgentSummary>();

  for (const record of records) {
    const current = grouped.get(record.agentMemberId) ?? {
      agentMemberId: record.agentMemberId,
      agentMemberName: record.agentMemberName,
      cash: 0,
      gpay: 0,
      total: 0,
    };

    current.cash = roundMoney(current.cash + record.cash);
    current.gpay = roundMoney(current.gpay + record.gpay);
    current.total = collectedAmount(current.cash, current.gpay);
    grouped.set(record.agentMemberId, current);
  }

  return [...grouped.values()].sort((left, right) =>
    left.agentMemberName.localeCompare(right.agentMemberName),
  );
}

function buildRecords(
  subscribers: ChittySubscriber[],
  saved: Map<string, { cash: number; gpay: number }>,
  canViewAll: boolean,
  currentMemberId: string | null,
): ChittyPaymentRecord[] {
  return subscribers
    .filter((subscriber) => {
      const entry = saved.get(subscriber.chittyUserId);

      if (!subscriber.active && !entry) {
        return false;
      }

      if (canViewAll) {
        return true;
      }

      return Boolean(currentMemberId) && subscriber.agentMemberId === currentMemberId;
    })
    .map((subscriber) => {
      const entry = saved.get(subscriber.chittyUserId);

      return {
        chittyUserId: subscriber.chittyUserId,
        userName: subscriber.userName,
        phone: subscriber.phone,
        agentMemberId: subscriber.agentMemberId,
        agentMemberName: subscriber.agentMemberName,
        cash: entry?.cash ?? 0,
        gpay: entry?.gpay ?? 0,
      };
    });
}

export async function getChittyPayments(input?: {
  chittyId?: string;
  date?: string;
}): Promise<ChittyPaymentView> {
  await assertCanAccessChitty();
  await connectMongo();

  const editor = await loadEditor();
  const schemes = await listChittySchemes();
  const chittyId = input?.chittyId || defaultChittyId(schemes);

  if (!chittyId) {
    return emptyView(editor, schemes);
  }

  const scheme = schemes.find((item) => item.id === chittyId);

  if (!scheme) {
    throw new AppError("Chitty not found.", 404);
  }

  const now = new Date();
  const dateOptions = toSundayDateValues(scheme.startDate, now);
  const selectedDate = input?.date ?? resolveDefaultSundayDate(dateOptions, toDateInputValue(now));

  if (!isSunday(parseDateInputValue(selectedDate)) || !dateOptions.includes(selectedDate)) {
    throw new AppError("Select a Sunday from the list.", 400);
  }

  const [subscribers, stored] = await Promise.all([
    loadChittySubscribers(chittyId),
    loadStoredWeeks(chittyId),
  ]);
  const week = stored.get(selectedDate);
  const saved = new Map(
    (week?.entries ?? []).map((entry) => [
      entry.chittyUserId.toString(),
      { cash: entry.cash, gpay: entry.gpay },
    ]),
  );
  const permissions = sheetPermissions({
    role: editor.role,
    schemeStatus: scheme.status,
    dayClosed: week?.closed ?? false,
    sheetDate: parseDateInputValue(selectedDate),
    now,
  });
  const records = buildRecords(subscribers, saved, permissions.canEditAll, editor.currentMemberId);
  const chain = balanceChainForSundays(dateOptions, stored);
  const settlementRow = chain.find((row) => row.date === selectedDate);

  return {
    chittyId,
    chittyName: scheme.name,
    chittyStatus: scheme.status,
    schemes,
    date: selectedDate,
    dateOptions,
    dayClosed: week?.closed ?? false,
    schemeClosed: permissions.schemeClosed,
    editorRole: editor.role,
    canEditPayments: permissions.canEditPayments,
    canEditAll: permissions.canEditAll,
    canEditDisbursement: permissions.canEditDisbursement,
    canCloseDay: permissions.canCloseDay,
    blockReason: permissions.blockReason,
    currentMemberId: editor.currentMemberId,
    records,
    summaries: buildSummaries(records),
    grandTotal: roundMoney(records.reduce((sum, record) => sum + record.cash + record.gpay, 0)),
    settlement:
      permissions.canEditAll && settlementRow
        ? {
            previousPending: settlementRow.previousPending,
            collected: settlementRow.collected,
            collection: settlementRow.collection,
            disbursedAmount: settlementRow.disbursedAmount,
            balance: settlementRow.balance,
          }
        : null,
  };
}

export async function saveChittyPayments(
  input: unknown,
  userId: string,
): Promise<ChittyPaymentView> {
  await assertCanAccessChitty();
  await connectMongo();

  const data = parseInput(SaveChittyPaymentsSchema, input);
  const editor = await loadEditor();
  const scheme = await Chitty.findById(data.chittyId).lean();

  if (!scheme) {
    throw new AppError("Chitty not found.", 404);
  }

  const now = new Date();
  const dateOptions = toSundayDateValues(scheme.startDate, now);
  const sheetDate = parseDateInputValue(data.date);

  if (!isSunday(sheetDate) || !dateOptions.includes(data.date)) {
    throw new AppError("Payments can only be saved for a listed Sunday.", 400);
  }

  const [subscribers, existing] = await Promise.all([
    loadChittySubscribers(data.chittyId),
    ChittyWeek.findOne({ chittyId: scheme._id, date: sheetDate }),
  ]);
  const permissions = sheetPermissions({
    role: editor.role,
    schemeStatus: scheme.status,
    dayClosed: existing?.closed ?? false,
    sheetDate,
    now,
  });

  if (!permissions.canEditPayments && !permissions.canEditDisbursement) {
    throw new AppError(permissions.blockReason ?? "These payments cannot be edited.", 400);
  }

  const subscribersById = new Map(
    subscribers.map((subscriber) => [subscriber.chittyUserId, subscriber]),
  );
  const saved = new Map(
    (existing?.entries ?? []).map((entry) => [
      entry.chittyUserId.toString(),
      { cash: entry.cash, gpay: entry.gpay },
    ]),
  );

  if (permissions.canEditPayments) {
    for (const record of data.records) {
      const subscriber = subscribersById.get(record.chittyUserId);

      if (!subscriber) {
        throw new AppError("One of the chitty users does not belong to this chitty.", 400);
      }

      const canEditRow = canEditChittyPaymentRow({
        canEditSheet: true,
        canEditAll: permissions.canEditAll,
        currentMemberId: editor.currentMemberId,
        rowAgentMemberId: subscriber.agentMemberId,
      });

      if (!canEditRow) {
        continue;
      }

      saved.set(record.chittyUserId, {
        cash: roundMoney(record.cash),
        gpay: roundMoney(record.gpay),
      });
    }
  }

  const entries = [...saved.entries()].map(([chittyUserId, amounts]) => ({
    chittyUserId: new Types.ObjectId(chittyUserId),
    cash: amounts.cash,
    gpay: amounts.gpay,
  }));

  const disbursedAmount =
    data.disbursedAmount !== undefined && permissions.canEditDisbursement
      ? roundMoney(data.disbursedAmount)
      : (existing?.disbursedAmount ?? 0);

  if (existing) {
    existing.entries = entries;
    existing.disbursedAmount = disbursedAmount;
    existing.updatedBy = new Types.ObjectId(userId);
    await existing.save();
  } else {
    await ChittyWeek.create({
      chittyId: scheme._id,
      date: sheetDate,
      closed: false,
      disbursedAmount,
      entries,
      updatedBy: new Types.ObjectId(userId),
    });
  }

  return getChittyPayments({ chittyId: data.chittyId, date: data.date });
}

export async function closeChittyWeek(input: unknown, userId: string): Promise<ChittyPaymentView> {
  await assertCanAccessChitty();
  await connectMongo();

  const data = parseInput(CloseChittyWeekSchema, input);
  const editor = await loadEditor();
  const scheme = await Chitty.findById(data.chittyId);

  if (!scheme) {
    throw new AppError("Chitty not found.", 404);
  }

  const now = new Date();
  const dateOptions = toSundayDateValues(scheme.startDate, now);
  const sheetDate = parseDateInputValue(data.date);

  if (!isSunday(sheetDate) || !dateOptions.includes(data.date)) {
    throw new AppError("Only a listed Sunday can be closed.", 400);
  }

  let week = await ChittyWeek.findOne({ chittyId: scheme._id, date: sheetDate });
  const permissions = sheetPermissions({
    role: editor.role,
    schemeStatus: scheme.status,
    dayClosed: week?.closed ?? false,
    sheetDate,
    now,
  });

  if (!permissions.canCloseDay) {
    throw new AppError("This Sunday cannot be closed.", 400);
  }

  if (!week) {
    week = new ChittyWeek({
      chittyId: scheme._id,
      date: sheetDate,
      entries: [],
      disbursedAmount: 0,
    });
  }

  week.closed = true;
  week.closedAt = now;
  week.closedBy = new Types.ObjectId(userId);
  week.updatedBy = new Types.ObjectId(userId);
  await week.save();

  return getChittyPayments({ chittyId: data.chittyId, date: data.date });
}
