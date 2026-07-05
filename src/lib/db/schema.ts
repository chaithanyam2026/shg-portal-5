import {
    Schema,
    SchemaDefinition,
    SchemaOptions,
} from 'mongoose';

import { createSchemaOptions } from './schema-options';

/**
 * Creates a standard application schema.
 */
export function createSchema<T>(
    definition: SchemaDefinition<T>,
    options?: SchemaOptions,
): Schema<T> {
    return new Schema<T>(definition, {
        ...createSchemaOptions(),
        ...options,
    });
}