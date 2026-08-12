import {
  Schema,
  type SchemaDefinition,
  type SchemaOptions,
} from "mongoose";

import { createSchemaOptions } from "./schema-options";

/**
 * Creates a standard application schema.
 *
 * Do NOT force generic document types here.
 * Let Mongoose infer the schema shape.
 */
export function createSchema(
  definition: SchemaDefinition,
  options?: SchemaOptions,
) {
  return new Schema(definition, {
    ...createSchemaOptions(),
    ...options,
  });
}