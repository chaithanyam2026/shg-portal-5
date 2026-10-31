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
  CHITTY_INSTALLMENT_PAYMENT,
  isSunday,
  payablePreviousBalance,
  pendingBalanceBefore,
  presentPayment,
  resolveChittyEditorRole,
  resolveDefaultSundayDate,
  roundMoney,
  toSundayDateValues,
  userPaymentAmount,
  type ChittyStoredEntryAmounts,
} from "../domain";
import type { ChittyAgentSummary, ChittyPaymentRecord, ChittyPaymentView } from "../types";
import { CloseChittyWeekSchema, SaveChittyPaymentsSchema } from "../validation";

import { assertCanAccessChitty } from "./assert-can-access";
import { loadChittySubscribers, type ChittySubscriber } from "./internal/load-subscribers";
import { parseInput } from "./internal/parse";
import { sheetPermissions } from "./internal/permissions";
import { defaultChittyId } from "./internal/scheme-order";
import { balanceChainForSundays, loadStoredWeeks, priorUserEntries } from "./internal/week-chain";
import { listChittySchemes } from "./schemes";

type EditorContext = {
  role: ReturnType<typeof resolveChittyEditorRole>;
  currentMemberId: string | null;
  userId: string;
};

type SavedEntry = ChittyStoredEntryAmounts & {
  cash: number;
  gpay: number;
};

function toSavedEntry(entry: ChittyStoredEntryAmounts): SavedEntry {
  return {
    cash: entry.cash ?? 0,
    gpay: entry.gpay ?? 0,
    paymentMode:
      entry.paymentMode === CHITTY_INSTALLMENT_PAYMENT ? CHITTY_INSTALLMENT_PAYMENT : undefined,
    paid: entry.paid,
    previousBalancePayment: entry.previousBalancePayment,
    auctionAmount: entry.auctionAmount,
  };
}

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
    weeklyAmount: 0,
    isAuction: false,
    records: [],
    summaries: [],
    grandTotal: 0,
    settlement: null,
  };
}

function buildSummaries(
  records: ChittyPaymentRecord[],
  weeklyAmount: number,
): ChittyAgentSummary[] {
  const grouped = new Map<string, ChittyAgentSummary>();

  for (const record of records) {
    const current = grouped.get(record.agentMemberId) ?? {
      agentMemberId: record.agentMemberId,
      agentMemberName: record.agentMemberName,
      weeklyPaid: 0,
      previousBalancePaid: 0,
      total: 0,
    };
    const previousBalancePaid = payablePreviousBalance(
      record.pendingBalance,
      record.previousBalancePayment,
    );

    current.weeklyPaid = roundMoney(current.weeklyPaid + (record.paid ? weeklyAmount : 0));
    current.previousBalancePaid = roundMoney(current.previousBalancePaid + previousBalancePaid);
    current.total = roundMoney(current.weeklyPaid + current.previousBalancePaid);
    grouped.set(record.agentMemberId, current);
  }

  return [...grouped.values()].sort((left, right) =>
    left.agentMemberName.localeCompare(right.agentMemberName),
  );
}

function buildRecords(
  subscribers: ChittySubscriber[],
  saved: Map<string, SavedEntry>,
  canViewAll: boolean,
  currentMemberId: string | null,
  weeklyAmount: number,
  pendingFor: (chittyUserId: string) => number,
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
      const pendingBalance = pendingFor(subscriber.chittyUserId);
      const presented = presentPayment(entry, weeklyAmount, pendingBalance);

      return {
        chittyUserId: subscriber.chittyUserId,
        userName: subscriber.userName,
        phone: subscriber.phone,
        agentMemberId: subscriber.agentMemberId,
        agentMemberName: subscriber.agentMemberName,
        pendingBalance,
        ...presented,
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
    (week?.entries ?? []).map((entry) => [entry.chittyUserId.toString(), toSavedEntry(entry)]),
  );
  const permissions = sheetPermissions({
    role: editor.role,
    schemeStatus: scheme.status,
    dayClosed: week?.closed ?? false,
    sheetDate: parseDateInputValue(selectedDate),
    now,
  });
  const weeklyAmount = scheme.weeklyAmount ?? 0;
  const records = buildRecords(
    subscribers,
    saved,
    permissions.canEditAll,
    editor.currentMemberId,
    weeklyAmount,
    (chittyUserId) =>
      pendingBalanceBefore(
        priorUserEntries(dateOptions, selectedDate, stored, chittyUserId),
        weeklyAmount,
      ),
  );
  const chain = balanceChainForSundays(dateOptions, stored, weeklyAmount);
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
    weeklyAmount,
    isAuction: scheme.isAuction ?? false,
    records,
    summaries: buildSummaries(records, weeklyAmount),
    grandTotal: roundMoney(
      records.reduce(
        (sum, record) =>
          sum +
          userPaymentAmount(
            record.paid,
            weeklyAmount,
            record.pendingBalance,
            record.previousBalancePayment,
          ),
        0,
      ),
    ),
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

  const [subscribers, stored] = await Promise.all([
    loadChittySubscribers(data.chittyId),
    loadStoredWeeks(data.chittyId),
  ]);
  const existing = stored.get(data.date);
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
    (existing?.entries ?? []).map((entry) => [entry.chittyUserId.toString(), toSavedEntry(entry)]),
  );
  const weeklyAmount = scheme.weeklyAmount ?? 0;

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

      const current = saved.get(record.chittyUserId);
      const pendingBalance = pendingBalanceBefore(
        priorUserEntries(dateOptions, data.date, stored, record.chittyUserId),
        weeklyAmount,
      );
      const presented = presentPayment(current, weeklyAmount, pendingBalance);
      const previousBalancePayment = payablePreviousBalance(
        pendingBalance,
        record.previousBalancePayment,
      );
      const auctionAmount = scheme.isAuction ? roundMoney(record.auctionAmount ?? 0) : 0;

      if (
        presented.paid === record.paid &&
        presented.previousBalancePayment === previousBalancePayment &&
        presented.auctionAmount === auctionAmount
      ) {
        continue;
      }

      saved.set(record.chittyUserId, {
        cash: 0,
        gpay: 0,
        paymentMode: CHITTY_INSTALLMENT_PAYMENT,
        paid: record.paid,
        previousBalancePayment,
        auctionAmount,
      });
    }
  }

  const entries = [...saved.entries()].map(([chittyUserId, amounts]) =>
    amounts.paymentMode === CHITTY_INSTALLMENT_PAYMENT
      ? {
          chittyUserId: new Types.ObjectId(chittyUserId),
          cash: 0,
          gpay: 0,
          paymentMode: CHITTY_INSTALLMENT_PAYMENT,
          paid: Boolean(amounts.paid),
          previousBalancePayment: roundMoney(amounts.previousBalancePayment ?? 0),
          auctionAmount: roundMoney(amounts.auctionAmount ?? 0),
        }
      : {
          chittyUserId: new Types.ObjectId(chittyUserId),
          cash: roundMoney(amounts.cash),
          gpay: roundMoney(amounts.gpay),
        },
  );

  const disbursedAmount =
    data.disbursedAmount !== undefined && permissions.canEditDisbursement
      ? roundMoney(data.disbursedAmount)
      : (existing?.disbursedAmount ?? 0);

  await ChittyWeek.findOneAndUpdate(
    { chittyId: scheme._id, date: sheetDate },
    {
      $set: {
        entries,
        disbursedAmount,
        updatedBy: new Types.ObjectId(userId),
      },
      $setOnInsert: {
        chittyId: scheme._id,
        date: sheetDate,
        closed: false,
      },
    },
    { upsert: true },
  );

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

  const existing = await ChittyWeek.findOne({ chittyId: scheme._id, date: sheetDate })
    .select("closed")
    .lean();
  const permissions = sheetPermissions({
    role: editor.role,
    schemeStatus: scheme.status,
    dayClosed: existing?.closed ?? false,
    sheetDate,
    now,
  });

  if (!permissions.canCloseDay) {
    throw new AppError("This Sunday cannot be closed.", 400);
  }

  await ChittyWeek.findOneAndUpdate(
    { chittyId: scheme._id, date: sheetDate },
    {
      $set: {
        closed: true,
        closedAt: now,
        closedBy: new Types.ObjectId(userId),
        updatedBy: new Types.ObjectId(userId),
      },
      $setOnInsert: {
        chittyId: scheme._id,
        date: sheetDate,
        entries: [],
        disbursedAmount: 0,
      },
    },
    { upsert: true },
  );

  return getChittyPayments({ chittyId: data.chittyId, date: data.date });
}
