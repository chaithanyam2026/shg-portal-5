import path from "node:path";

import dotenv from "dotenv";

import { hashPassword } from "@/lib/auth/password";
import fs from "node:fs/promises";

import { USER_ROLES } from "@/lib/constants/roles";
import { USER_STATUS } from "@/lib/constants/user-status";

// -----------------------------------------------------------------------------
// Load .env.local BEFORE importing anything that reads process.env
// -----------------------------------------------------------------------------

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import connectMongo from "@/lib/db/mongodb";
import MemberModel from "@/models/Member";
import UserModel from "@/models/User";
import type { HydratedDocument } from "mongoose";

import type { MemberDocument } from "@/models/Member";
import type { UserDocument } from "@/models/User";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type MemberSeed = {
  memberCode: string;
  name: string;
  phone: string;
  address?: string;
  username: string;
  password: string;
  role?: string;
  joinDate?: string;
  active?: boolean;
  deactivatedDate?: string;
  remarks?: string;
};

// -----------------------------------------------------------------------------
// Seed Data
// -----------------------------------------------------------------------------

async function loadMembers(): Promise<MemberSeed[]> {
  const file = path.join(process.cwd(), "src", "scripts", "data", "members.json");

  const json = await fs.readFile(file, "utf8");

  return JSON.parse(json) as MemberSeed[];
}

async function syncUserLink(
  user: HydratedDocument<UserDocument>,
  member: HydratedDocument<MemberDocument>,
  active: boolean,
) {
  user.memberId = member._id;
  user.status = active ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE;
  await user.save();

  if (!member.userId.equals(user._id)) {
    member.userId = user._id;
    await member.save();
  }
}

async function updateMemberFromSeed(
  memberDoc: HydratedDocument<MemberDocument>,
  seed: MemberSeed,
  active: boolean,
  joinDate: Date,
  deactivatedDate: Date | null,
) {
  memberDoc.memberCode = seed.memberCode.toUpperCase();
  memberDoc.name = seed.name;
  memberDoc.phone = seed.phone;
  memberDoc.address = seed.address ?? "";
  memberDoc.joinDate = joinDate;
  memberDoc.remarks = seed.remarks ?? "";
  memberDoc.active = active;
  memberDoc.deactivatedDate = deactivatedDate;
  await memberDoc.save();
}

// -----------------------------------------------------------------------------
// Seed
// -----------------------------------------------------------------------------

async function seedMembers() {
  console.log("------------------------------------");
  console.log("SHG Portal Member Seeder");
  console.log("------------------------------------");

  const members = await loadMembers();

  console.log("MongoDB URI:", process.env.MONGODB_URI ? "Loaded" : "NOT FOUND");

  await connectMongo();

  console.log("Connected to MongoDB");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const member of members) {
    const memberCode = member.memberCode.toUpperCase();
    const username = member.username.toLowerCase();
    const active = member.active ?? true;
    const joinDate = member.joinDate ? new Date(member.joinDate) : new Date();
    const deactivatedDate =
      !active && member.deactivatedDate ? new Date(member.deactivatedDate) : null;

    const existingByCode = await MemberModel.findOne({ memberCode });
    const existingUser = await UserModel.findOne({ username });
    const existingByUser = existingUser
      ? await MemberModel.findOne({ userId: existingUser._id })
      : null;

    const existingMember = existingByCode ?? existingByUser;

    if (existingMember) {
      const phoneConflict = await MemberModel.findOne({
        phone: member.phone,
        _id: { $ne: existingMember._id },
      });

      if (phoneConflict) {
        skipped++;
        console.log(
          `Skipped ${memberCode}: phone ${member.phone} already used by ${phoneConflict.memberCode}`,
        );
        continue;
      }

      await updateMemberFromSeed(existingMember, member, active, joinDate, deactivatedDate);

      let linkedUser = existingUser;

      if (!linkedUser) {
        linkedUser = await UserModel.findById(existingMember.userId);
      }

      if (linkedUser) {
        await syncUserLink(linkedUser, existingMember, active);
      } else {
        const passwordHash = await hashPassword(member.password);
        const user = await UserModel.create({
          username,
          passwordHash,
          role: member.role ? member.role.toUpperCase() : USER_ROLES.MEMBER,
          status: active ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE,
          memberId: existingMember._id,
        });

        existingMember.userId = user._id;
        await existingMember.save();
      }

      updated++;
      console.log(`Updated ${memberCode}`);
      continue;
    }

    const phoneConflict = await MemberModel.findOne({ phone: member.phone });

    if (phoneConflict) {
      skipped++;
      console.log(
        `Skipped ${memberCode}: phone ${member.phone} already used by ${phoneConflict.memberCode}`,
      );
      continue;
    }

    if (existingUser) {
      const createdMember = await MemberModel.create({
        memberCode,
        name: member.name,
        phone: member.phone,
        address: member.address ?? "",
        joinDate,
        remarks: member.remarks ?? "",
        active,
        deactivatedDate,
        userId: existingUser._id,
      });

      await syncUserLink(existingUser, createdMember, active);

      created++;
      console.log(`Created ${memberCode} (linked existing user ${username})`);
      continue;
    }

    const passwordHash = await hashPassword(member.password);
    const user = await UserModel.create({
      username,
      passwordHash,
      role: member.role ? member.role.toUpperCase() : USER_ROLES.MEMBER,
      status: active ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE,
      memberId: null,
    });

    const createdMember = await MemberModel.create({
      memberCode,
      name: member.name,
      phone: member.phone,
      address: member.address ?? "",
      joinDate,
      remarks: member.remarks ?? "",
      active,
      deactivatedDate,
      userId: user._id,
    });

    user.memberId = createdMember._id;
    await user.save();

    created++;
    console.log(`Created ${memberCode}`);
  }

  console.log("");
  console.log("------------------------------------");
  console.log("Completed");
  console.log("------------------------------------");
  console.log(`Created : ${created}`);
  console.log(`Updated : ${updated}`);
  console.log(`Skipped : ${skipped}`);

  process.exit(0);
}

// -----------------------------------------------------------------------------
// Execute
// -----------------------------------------------------------------------------

seedMembers().catch((error) => {
  console.error("");
  console.error("------------------------------------");
  console.error("Member Seeder Failed");
  console.error("------------------------------------");
  console.error(error);

  process.exit(1);
});
