/**
 * Individual passbook entry constants.
 */
export const LOAN_DISBURSED_ENTRY = "LOAN_DISBURSED";

export const LOAN_REPAYMENT_ENTRY = "LOAN_REPAYMENT";

export const LOAN_FINE_ENTRY = "LOAN_FINE";

export const LOAN_CLOSED_ENTRY = "LOAN_CLOSED";

/**
 * Collection of all entry types.
 */
export const PASSBOOK_ENTRY_TYPES = [
  LOAN_DISBURSED_ENTRY,
  LOAN_REPAYMENT_ENTRY,
  LOAN_FINE_ENTRY,
  LOAN_CLOSED_ENTRY,
] as const;

/**
 * Backward compatibility.
 */
export const PASSBOOK_ENTRY_TYPE = PASSBOOK_ENTRY_TYPES;

/**
 * Passbook entry type.
 */
export type PassbookEntryType = (typeof PASSBOOK_ENTRY_TYPES)[number];

export function isLoanDisbursedEntry(type: PassbookEntryType): boolean {
  return type === LOAN_DISBURSED_ENTRY;
}

export function isRepaymentEntry(type: PassbookEntryType): boolean {
  return type === LOAN_REPAYMENT_ENTRY;
}

export function isFineEntry(type: PassbookEntryType): boolean {
  return type === LOAN_FINE_ENTRY;
}

export function isLoanClosedEntry(type: PassbookEntryType): boolean {
  return type === LOAN_CLOSED_ENTRY;
}

export function getPassbookEntryTypes() {
  return PASSBOOK_ENTRY_TYPES;
}
