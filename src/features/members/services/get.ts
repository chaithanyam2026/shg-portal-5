import { Types } from "mongoose";

import connectMongo from "@/lib/db/mongodb";

import Member from "@/models/Member";

import { AppError } from "@/lib/errors";

import type { MemberDetails } from "../types";

/**
 * Returns complete member details.
 */
export async function getMember(id: string): Promise<MemberDetails> {
  await connectMongo();

  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid member id.", 400);
  }

  const member = await Member.findById(id).lean();

  if (!member) {
    throw new AppError("Member not found.", 404);
  }

  return {
    _id: member._id.toString(),

    memberCode: member.memberCode,

    name: member.name,

    phone: member.phone ?? "",

    address: member.address ?? "",

    status: member.active ? "ACTIVE" : "INACTIVE",

    joinedDate: member.joinDate?.toISOString(),

    deactivatedDate: member.deactivatedDate?.toISOString(),

    remarks: member.remarks ?? "",
  };
}
