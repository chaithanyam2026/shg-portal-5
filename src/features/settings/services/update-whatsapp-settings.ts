import { requireRole } from "@/lib/auth/guards";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import connectMongo from "@/lib/db/mongodb";
import AppSettings from "@/models/AppSettings";

import { UpdateWhatsappSettingsSchema, type WhatsappSettings } from "../validation";

const SETTINGS_KEY = "app";

export async function updateWhatsappSettings(input: unknown): Promise<WhatsappSettings> {
  await requireRole(ADMIN_ROLES);
  await connectMongo();

  const data = UpdateWhatsappSettingsSchema.parse(input);

  const settings = await AppSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    {
      $set: { whatsappMeetingCloseEnabled: data.whatsappMeetingCloseEnabled },
      $setOnInsert: { key: SETTINGS_KEY },
    },
    { upsert: true, returnDocument: "after" },
  ).lean();

  return {
    whatsappMeetingCloseEnabled: Boolean(settings?.whatsappMeetingCloseEnabled),
  };
}
