import path from "node:path";

import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import connectMongo from "@/lib/db/mongodb";
import Meeting from "@/models/Meeting";

async function fixMeetingIndexes() {
  await connectMongo();

  const collection = Meeting.collection;
  const indexes = await collection.indexes();

  for (const index of indexes) {
    const indexName = index.name;

    if (!indexName || indexName === "_id_") {
      continue;
    }

    const keys = Object.keys(index.key);

    if (keys.includes("date") && !keys.includes("meetingDate")) {
      await collection.dropIndex(indexName);
      console.log(`Dropped stale index: ${indexName}`);
    }
  }

  await Meeting.syncIndexes();
  console.log("Meeting indexes synced.");

  const updatedIndexes = await collection.indexes();
  console.log(
    "Current indexes:",
    updatedIndexes.map((index) => `${index.name}: ${JSON.stringify(index.key)}`).join("\n  "),
  );
}

fixMeetingIndexes().catch((error) => {
  console.error(error);
  process.exit(1);
});
