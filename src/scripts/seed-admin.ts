import path from "node:path";

import dotenv from "dotenv";
import fs from "node:fs/promises";

import { hashPassword } from "@/lib/auth/password";
import { USER_ROLES } from "@/lib/constants/roles";
import { USER_STATUS } from "@/lib/constants/user-status";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import connectMongo from "@/lib/db/mongodb";
import User from "@/models/User";

type AdminSeed = {
  username: string;
  password: string;
};

async function loadAdmins(): Promise<AdminSeed[]> {
  const file = path.join(process.cwd(), "src", "scripts", "data", "admins.json");
  const json = await fs.readFile(file, "utf8");

  return JSON.parse(json) as AdminSeed[];
}

async function seedAdmins() {
  console.log("------------------------------------");
  console.log("SHG Portal Admin Seeder");
  console.log("------------------------------------");

  const admins = await loadAdmins();

  console.log("MongoDB URI:", process.env.MONGODB_URI ? "Loaded" : "NOT FOUND");

  await connectMongo();

  console.log("Connected to MongoDB");

  let created = 0;
  let skipped = 0;

  for (const admin of admins) {
    const username = admin.username.toLowerCase();

    console.log("Checking if admin exists:", username);

    const existing = await User.findOne({ username }).select("_id").lean();

    console.log("Admin exists:", existing ? "Yes" : "No");

    if (existing) {
      skipped++;
      console.log(`Skipped ${username}`);
      continue;
    }

    const passwordHash = await hashPassword(admin.password);

    await User.create({
      username,
      passwordHash,
      role: USER_ROLES.ADMIN,
      status: USER_STATUS.ACTIVE,
      memberId: null,
    });

    created++;
    console.log(`Created ${username}`);
  }

  console.log("");
  console.log("------------------------------------");
  console.log("Completed");
  console.log("------------------------------------");
  console.log(`Created : ${created}`);
  console.log(`Skipped : ${skipped}`);

  process.exit(0);
}

seedAdmins().catch((error) => {
  console.error("");
  console.error("------------------------------------");
  console.error("Admin Seeder Failed");
  console.error("------------------------------------");
  console.error(error);

  process.exit(1);
});
