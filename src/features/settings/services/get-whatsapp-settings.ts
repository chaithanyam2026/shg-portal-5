import { requireRole } from "@/lib/auth/guards";
import { ADMIN_ROLES } from "@/lib/auth/roles";

import type { WhatsappSettings } from "../validation";
import { readWhatsappSettings } from "./read-whatsapp-settings";

export async function getWhatsappSettings(): Promise<WhatsappSettings> {
  await requireRole(ADMIN_ROLES);
  return readWhatsappSettings();
}
