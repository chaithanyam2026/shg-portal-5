import { HydratedDocument, Model, Schema, model, models } from "mongoose";

import { createSchemaOptions } from "@/lib/db/schema-options";

export interface AppSettingsDocument {
  key: string;
  whatsappMeetingCloseEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AppSettingsHydratedDocument = HydratedDocument<AppSettingsDocument>;

const appSettingsSchema = new Schema<AppSettingsDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "app",
    },
    whatsappMeetingCloseEnabled: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  createSchemaOptions(),
);

const AppSettings: Model<AppSettingsDocument> =
  (models.AppSettings as Model<AppSettingsDocument>) ??
  model<AppSettingsDocument>("AppSettings", appSettingsSchema);

export default AppSettings;
