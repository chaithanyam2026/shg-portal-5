import { Types } from "mongoose";

import { auth } from "@/auth";
import { canCurrentUserAccessFinancialStewardArea } from "@/features/financial-year/services";
import { getCurrentMemberId } from "@/lib/auth/current-member";
import { isAdminRole } from "@/lib/auth/roles";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import { parseDateInputValue, toDateInputValue } from "@/lib/utils/date";
import ChittyPaymentSheet from "@/models/ChittyPaymentSheet";

import { isChittyPaymentLocked, isSunday, resolveDefaultSundayDate } from "../domain";
import type { ChittyPaymentRecord, ChittyPaymentSheet as ChittyPaymentSheetView } from "../types";

import { assertCanAccessChitty } from "./assert-can-access";
import { loadActiveChittyMembers } from "./internal/load-active-members";
import { loadChittySundayOptions } from "./internal/sunday-options";
import { emptyPaymentEntry, sumChittyPaymentTotals } from "./internal/totals";

function buildRecords(
  members: Awaited<ReturnType<typeof loadActiveChittyMembers>>,
  savedByMember: Map<
    string,
    { cash: number; gpay: number; gpayChecked?: boolean; missingCount: number; remarks: string }
  >,
): ChittyPaymentRecord[] {
  return members.map((member) => {
    const saved = savedByMember.get(member.memberId) ?? emptyPaymentEntry();

    return {
      memberId: member.memberId,
      memberCode: member.memberCode,
      memberName: member.memberName,
      cash: saved.cash,
      gpay: saved.gpay,
      gpayChecked: Boolean(saved.gpayChecked),
      missingCount: saved.missingCount,
      remarks: saved.remarks,
    };
  });
}

export async function getChittyPayments(dateInput?: string): Promise<ChittyPaymentSheetView> {
  await assertCanAccessChitty();
  await connectMongo();

  const now = new Date();
  const dateOptions = await loadChittySundayOptions(now);
  const today = toDateInputValue(now);
  const selectedDate = dateInput ?? resolveDefaultSundayDate(dateOptions, today);
  const sheetDate = parseDateInputValue(selectedDate);

  if (!isSunday(sheetDate) || !dateOptions.includes(selectedDate)) {
    throw new AppError("Select a Sunday from the list.", 400);
  }

  const [members, sheet, canEditAll, currentMemberId, session] = await Promise.all([
    loadActiveChittyMembers(),
    ChittyPaymentSheet.findOne({ date: sheetDate }).lean(),
    canCurrentUserAccessFinancialStewardArea(),
    getCurrentMemberId(),
    auth(),
  ]);
  const canEditPast = isAdminRole(session?.user.role);

  const savedByMember = new Map(
    (sheet?.entries ?? []).map((entry) => [entry.memberId.toString(), entry]),
  );
  const records = buildRecords(members, savedByMember);

  return {
    date: selectedDate,
    dateOptions,
    locked: isChittyPaymentLocked(now, sheetDate, { allowPastEdits: canEditPast }),
    canEditAll,
    canEditPast,
    currentMemberId,
    records,
    totals: sumChittyPaymentTotals(records),
  };
}

export async function saveChittyPayments(input: {
  date: string;
  records: Array<{
    memberId: string;
    cash: number;
    gpay: number;
    gpayChecked: boolean;
    missingCount: number;
    remarks: string;
  }>;
  userId: string;
}): Promise<ChittyPaymentSheetView> {
  await assertCanAccessChitty();
  await connectMongo();

  const now = new Date();
  const dateOptions = await loadChittySundayOptions(now);
  const sheetDate = parseDateInputValue(input.date);

  if (!isSunday(sheetDate) || !dateOptions.includes(input.date)) {
    throw new AppError("Payments can only be saved for a listed Sunday.", 400);
  }

  const [members, existing, canEditAll, currentMemberId, session] = await Promise.all([
    loadActiveChittyMembers(),
    ChittyPaymentSheet.findOne({ date: sheetDate }).lean(),
    canCurrentUserAccessFinancialStewardArea(),
    getCurrentMemberId(),
    auth(),
  ]);
  const canEditPast = isAdminRole(session?.user.role);

  if (isChittyPaymentLocked(now, sheetDate, { allowPastEdits: canEditPast })) {
    throw new AppError(
      "Chitty payments can only be edited for the current Sunday before 7:45 PM.",
      400,
    );
  }

  if (!canEditAll && !currentMemberId) {
    throw new AppError("You can only update your own payment row.", 403);
  }

  const savedByMember = new Map(
    (existing?.entries ?? []).map((entry) => [entry.memberId.toString(), entry]),
  );
  const incoming = new Map(input.records.map((record) => [record.memberId, record]));

  const entries = members.map((member) => {
    const previous = savedByMember.get(member.memberId) ?? emptyPaymentEntry();
    const next = incoming.get(member.memberId);
    const canEditRow = canEditPast || canEditAll || member.memberId === currentMemberId;
    const record = canEditRow && next ? next : previous;

    return {
      memberId: new Types.ObjectId(member.memberId),
      cash: record.cash,
      gpay: record.gpay,
      gpayChecked: Boolean(record.gpayChecked),
      missingCount: record.missingCount,
      remarks: record.remarks,
    };
  });

  await ChittyPaymentSheet.findOneAndUpdate(
    { date: sheetDate },
    {
      $set: {
        entries,
        updatedBy: new Types.ObjectId(input.userId),
      },
    },
    { upsert: true },
  );

  return getChittyPayments(input.date);
}
