import { Types } from "mongoose";

import { requireRole } from "@/lib/auth/guards";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import connectMongo from "@/lib/db/mongodb";
import { AppError } from "@/lib/errors";
import { parseDateInputValue, toDateInputValue } from "@/lib/utils/date";
import Chitty from "@/models/Chitty";

import { CHITTY_STATUSES } from "../domain";
import type { ChittySchemeOption } from "../types";
import { CreateChittySchema, ObjectIdSchema, UpdateChittySchema } from "../validation";

import { assertCanAccessChitty } from "./assert-can-access";
import { parseInput } from "./internal/parse";
import { sortChittySchemes } from "./internal/scheme-order";

function mapScheme(doc: {
  _id: Types.ObjectId;
  name: string;
  code: string;
  status: ChittySchemeOption["status"];
  startDate: Date;
  weeklyAmount?: number;
  isAuction?: boolean;
}): ChittySchemeOption {
  return {
    id: doc._id.toString(),
    name: doc.name,
    code: doc.code,
    status: doc.status,
    startDate: toDateInputValue(doc.startDate),
    weeklyAmount: doc.weeklyAmount ?? 0,
    isAuction: doc.isAuction ?? false,
  };
}

export async function listChittySchemes(): Promise<ChittySchemeOption[]> {
  await assertCanAccessChitty();
  await connectMongo();

  const schemes = await Chitty.find().sort({ createdAt: 1 }).lean();

  return sortChittySchemes(schemes.map(mapScheme));
}

export async function createChitty(input: unknown, userId: string): Promise<ChittySchemeOption> {
  await requireRole(ADMIN_ROLES);
  await connectMongo();

  const data = parseInput(CreateChittySchema, input);
  const existing = await Chitty.findOne({ code: data.code }).select("_id").lean();

  if (existing) {
    throw new AppError("A chitty with this code already exists.", 400);
  }

  const scheme = await Chitty.create({
    name: data.name,
    code: data.code.trim().toUpperCase(),
    startDate: parseDateInputValue(data.startDate),
    weeklyAmount: data.weeklyAmount,
    isAuction: data.isAuction,
    status: data.status ?? CHITTY_STATUSES.ACTIVE,
    createdBy: new Types.ObjectId(userId),
  });

  return mapScheme(scheme);
}

export async function updateChitty(chittyId: string, input: unknown): Promise<ChittySchemeOption> {
  await requireRole(ADMIN_ROLES);
  await connectMongo();

  const data = parseInput(UpdateChittySchema, input);
  const id = parseInput(ObjectIdSchema, chittyId);
  const update: {
    name?: string;
    code?: string;
    startDate?: Date;
    status?: ChittySchemeOption["status"];
    weeklyAmount?: number;
    isAuction?: boolean;
  } = {};

  if (data.name !== undefined) {
    update.name = data.name;
  }

  if (data.code !== undefined) {
    const code = data.code.trim().toUpperCase();
    const existing = await Chitty.findOne({ code, _id: { $ne: id } })
      .select("_id")
      .lean();

    if (existing) {
      throw new AppError("A chitty with this code already exists.", 400);
    }

    update.code = code;
  }

  if (data.startDate !== undefined) {
    update.startDate = parseDateInputValue(data.startDate);
  }

  if (data.status !== undefined) {
    update.status = data.status;
  }

  if (data.weeklyAmount !== undefined) {
    update.weeklyAmount = data.weeklyAmount;
  }

  if (data.isAuction !== undefined) {
    update.isAuction = data.isAuction;
  }

  const scheme = await Chitty.findById(id);

  if (!scheme) {
    throw new AppError("Chitty not found.", 404);
  }

  scheme.set(update);
  await scheme.save();

  return mapScheme(scheme);
}
