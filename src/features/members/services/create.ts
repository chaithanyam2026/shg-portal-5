import connectMongo from "@/lib/db/mongodb";

import { hashPassword } from "@/lib/auth/password";
import { USER_ROLES } from "@/lib/constants/roles";
import { USER_STATUS } from "@/lib/constants/user-status";
import { AppError } from "@/lib/errors";

import Member from "@/models/Member";
import User from "@/models/User";

import type { MemberDetails } from "../types";
import { CreateMemberInput, CreateMemberSchema } from "../validation";
import { assertCanAccessFinancialStewardArea } from "@/features/financial-year/services";

export async function createMember(input: CreateMemberInput): Promise<MemberDetails> {
  await connectMongo();
  await assertCanAccessFinancialStewardArea();

  const data = CreateMemberSchema.parse(input);

  const [existingMemberCode, existingPhone, existingUsername] = await Promise.all([
    Member.findOne({ memberCode: data.memberCode }).select("_id").lean(),
    Member.findOne({ phone: data.phone }).select("_id").lean(),
    User.findOne({ username: data.username }).select("_id").lean(),
  ]);

  if (existingMemberCode) {
    throw new AppError("Member code already exists.", 400);
  }

  if (existingPhone) {
    throw new AppError("Phone number already exists.", 400);
  }

  if (existingUsername) {
    throw new AppError("Username already exists.", 400);
  }

  const passwordHash = await hashPassword(data.password);

  const user = await User.create({
    username: data.username,
    passwordHash,
    role: USER_ROLES.MEMBER,
    status: USER_STATUS.ACTIVE,
    memberId: null,
  });

  const member = await Member.create({
    memberCode: data.memberCode,
    name: data.name,
    phone: data.phone,
    address: data.address ?? "",
    joinDate: data.joinDate,
    remarks: data.remarks ?? "",
    active: true,
    userId: user._id,
  });

  user.memberId = member._id;
  await user.save();

  const { revalidateMembers } = await import("@/lib/cache");
  revalidateMembers();

  return {
    _id: member._id.toString(),
    memberCode: member.memberCode,
    name: member.name,
    phone: member.phone,
    address: member.address ?? "",
    status: "ACTIVE",
    joinedDate: member.joinDate.toISOString(),
    deactivatedDate: member.deactivatedDate?.toISOString(),
    remarks: member.remarks ?? "",
  };
}
