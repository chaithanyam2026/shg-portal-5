import path from "node:path";

import dotenv from "dotenv";

import { hashPassword } from "@/lib/auth/password";
import fs from "node:fs/promises";

import { USER_ROLES } from "@/lib/constants/roles";

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
  let skipped = 0;

  for (const member of members) {
    const existing = await MemberModel.findOne({
      memberCode: member.memberCode,
    });

    if (existing) {
      const linkedUser = await UserModel.findById(existing.userId).select("memberId");

      if (linkedUser && !linkedUser.memberId) {
        linkedUser.memberId = existing._id;
        await linkedUser.save();
        console.log(`Repaired link for ${member.memberCode}`);
      }

      skipped++;

      console.log(`Skipped ${member.memberCode}`);

      continue;
    }

    const passwordHash = await hashPassword(member.password);
    const user = await UserModel.create({
      username: member.username.toLowerCase(),
      passwordHash,
      role: member.role ? member.role.toUpperCase() : USER_ROLES.MEMBER,
    });

    const createdMember = await MemberModel.create({
      memberCode: member.memberCode.toUpperCase(),
      name: member.name,
      phone: member.phone,
      address: member.address ?? "",
      joinDate: member.joinDate ? new Date(member.joinDate) : new Date(),
      remarks: member.remarks ?? "",
      active: true,
      userId: user._id,
    });

    user.memberId = createdMember._id;
    await user.save();

    created++;

    console.log(`Created ${member.memberCode}`);
  }

  console.log("");
  console.log("------------------------------------");
  console.log("Completed");
  console.log("------------------------------------");
  console.log(`Created : ${created}`);
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
