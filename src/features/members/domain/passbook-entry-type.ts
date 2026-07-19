/**
 * Member passbook entry types.
 */
export const OPENING_CONTRIBUTION_ENTRY = "OPENING_CONTRIBUTION";

export const WEEKLY_CONTRIBUTION_ENTRY = "WEEKLY_CONTRIBUTION";

/**
 * Collection of all entry types.
 */
export const MEMBER_PASSBOOK_ENTRY_TYPES = [
  OPENING_CONTRIBUTION_ENTRY,
  WEEKLY_CONTRIBUTION_ENTRY,
] as const;

/**
 * Member passbook entry type.
 */
export type MemberPassbookEntryType = (typeof MEMBER_PASSBOOK_ENTRY_TYPES)[number];

/**
 * Helpers.
 */
export function isOpeningContributionEntry(type: MemberPassbookEntryType) {
  return type === OPENING_CONTRIBUTION_ENTRY;
}

export function isWeeklyContributionEntry(type: MemberPassbookEntryType) {
  return type === WEEKLY_CONTRIBUTION_ENTRY;
}
