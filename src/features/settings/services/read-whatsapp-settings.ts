import connectMongo from "@/lib/db/mongodb";
import AppSettings from "@/models/AppSettings";

import type { WhatsappSettings } from "../validation";

const SETTINGS_KEY = "app";

export async function readWhatsappSettings(): Promise<WhatsappSettings> {
  await connectMongo();

  const settings = await AppSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $setOnInsert: { key: SETTINGS_KEY, whatsappMeetingCloseEnabled: false } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  ).lean();

  return {
    whatsappMeetingCloseEnabled: Boolean(settings?.whatsappMeetingCloseEnabled),
  };
}
