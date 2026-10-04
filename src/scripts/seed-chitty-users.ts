import path from "node:path";

import dotenv from "dotenv";
import fs from "node:fs/promises";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import connectMongo from "@/lib/db/mongodb";
import Chitty from "@/models/Chitty";
import ChittyUser from "@/models/ChittyUser";
import Member from "@/models/Member";

type ChittyUserSeed = {
  chittyCode: string;
  name: string;
  phone?: string;
  agentMemberCode: string;
};

async function loadSeeds(): Promise<ChittyUserSeed[]> {
  const file = path.join(process.cwd(), "src", "scripts", "data", "chitty-users.json");
  const json = await fs.readFile(file, "utf8");

  return JSON.parse(json) as ChittyUserSeed[];
}

async function seedChittyUsers() {
  console.log("------------------------------------");
  console.log("SHG Portal Chitty User Seeder");
  console.log("------------------------------------");

  const seeds = await loadSeeds();

  await connectMongo();
  console.log("Connected to MongoDB");

  let created = 0;
  let updated = 0;

  for (const seed of seeds) {
    const chittyCode = seed.chittyCode.trim().toUpperCase();
    const agentMemberCode = seed.agentMemberCode.trim().toUpperCase();
    const name = seed.name.trim();
    const phone = seed.phone?.trim() ?? "";

    const chitty = await Chitty.findOne({ code: chittyCode }).select("_id").lean();

    if (!chitty) {
      throw new Error(`Chitty not found for code ${chittyCode}. Create it before seeding users.`);
    }

    const member = await Member.findOne({ memberCode: agentMemberCode }).select("_id").lean();

    if (!member) {
      throw new Error(`Member not found for code ${agentMemberCode}.`);
    }

    const existing = await ChittyUser.findOne({
      chittyId: chitty._id,
      name,
      agentMemberId: member._id,
    });

    if (existing) {
      existing.phone = phone;
      existing.active = true;
      await existing.save();
      updated++;
      console.log(`Updated ${name} (${chittyCode})`);
      continue;
    }

    await ChittyUser.create({
      chittyId: chitty._id,
      name,
      phone,
      agentMemberId: member._id,
      active: true,
    });

    created++;
    console.log(`Created ${name} (${chittyCode})`);
  }

  console.log("");
  console.log("------------------------------------");
  console.log("Completed");
  console.log("------------------------------------");
  console.log(`Created : ${created}`);
  console.log(`Updated : ${updated}`);

  process.exit(0);
}

seedChittyUsers().catch((error) => {
  console.error("");
  console.error("------------------------------------");
  console.error("Chitty User Seeder Failed");
  console.error("------------------------------------");
  console.error(error);

  process.exit(1);
});
