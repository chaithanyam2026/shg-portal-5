import { LOAN_NUMBER_PREFIX } from "./loan-rules";

/**
 * Generates a loan number.
 *
 * Format:
 *
 * LN-000001
 * LN-000025
 * LN-001257
 */
export function generateLoanNumber(sequence: number): string {
  return `${LOAN_NUMBER_PREFIX}-${sequence.toString().padStart(6, "0")}`;
}

/**
 * Validates a loan number.
 */
export function isLoanNumber(value: string): boolean {
  const pattern = new RegExp(`^${LOAN_NUMBER_PREFIX}-\\d{6}$`);

  return pattern.test(value);
}

/**
 * Extracts the numeric sequence from
 * a loan number.
 *
 * Example:
 *
 * LN-000123 -> 123
 */
export function getLoanSequence(loanNumber: string): number {
  if (!isLoanNumber(loanNumber)) {
    throw new Error("Invalid loan number.");
  }

  return Number(loanNumber.split("-")[1]);
}
