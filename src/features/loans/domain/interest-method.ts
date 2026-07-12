export const INTEREST_METHOD = {
  SIMPLE: "SIMPLE",
} as const;

export const INTEREST_METHOD_VALUES =
  Object.values(INTEREST_METHOD);

export type InterestMethod =
  (typeof INTEREST_METHOD_VALUES)[number];