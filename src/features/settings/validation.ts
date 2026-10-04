import { z } from "zod";

export const UpdateWhatsappSettingsSchema = z.object({
  whatsappMeetingCloseEnabled: z.boolean(),
});

export type WhatsappSettings = {
  whatsappMeetingCloseEnabled: boolean;
};
