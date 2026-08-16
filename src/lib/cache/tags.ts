export const CACHE_TAGS = {
  members: "members",
  financialYears: "financial-years",
  meetings: "meetings",
  loans: "loans",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
