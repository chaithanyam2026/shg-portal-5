export const INTEREST_TYPE = {
  SIMPLE: "SIMPLE",
} as const;

export type InterestType = (typeof INTEREST_TYPE)[keyof typeof INTEREST_TYPE];

export const INTEREST_TYPE_OPTIONS = [
  {
    value: INTEREST_TYPE.SIMPLE,
    label: "Simple Interest",
  },
];
