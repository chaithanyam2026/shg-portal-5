/**
 * Database-wide constants.
 */

export const DATABASE = {
  DEFAULT_PAGE_SIZE: 20,

  MAX_PAGE_SIZE: 100,

  CONNECTION_TIMEOUT_MS: 5000,

  AUTO_INDEX: process.env.NODE_ENV !== "production",
} as const;
