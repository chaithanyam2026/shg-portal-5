import { SchemaOptions } from "mongoose";

import { DATABASE } from "@/lib/constants/database";

/**
 * Shared schema options.
 *
 * Every schema in the application
 * should use these defaults.
 */
export function createSchemaOptions(): SchemaOptions {
  return {
    timestamps: true,

    //versionKey: false,

    minimize: false,

    strict: true,

    optimisticConcurrency: true,

    autoIndex: DATABASE.AUTO_INDEX,
  };
}
