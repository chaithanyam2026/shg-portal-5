import type { MemberPassbook } from "./member-passbook";

/**
 * Validates a generated member
 * contribution passbook.
 *
 * Throws an Error when an
 * inconsistency is found.
 */
export function validateMemberPassbook(passbook: MemberPassbook): void {
  let previousDate: Date | undefined;

  let runningBalance = 0;

  let contributionCount = 0;

  for (const entry of passbook.entries) {
    /**
     * Date order.
     */
    if (previousDate && entry.transactionDate < previousDate) {
      throw new Error("Passbook entries are not ordered chronologically.");
    }

    previousDate = entry.transactionDate;

    /**
     * Contribution cannot
     * be negative.
     */
    if (entry.contribution < 0) {
      throw new Error("Contribution cannot be negative.");
    }

    /**
     * Running balance.
     */
    runningBalance += entry.contribution;

    if (entry.runningBalance !== runningBalance) {
      throw new Error("Invalid running balance.");
    }

    contributionCount++;
  }

  /**
   * Current balance.
   */
  if (runningBalance !== passbook.currentBalance) {
    throw new Error("Current balance mismatch.");
  }

  /**
   * Opening contribution.
   */
  if (
    passbook.entries.length > 0 &&
    passbook.entries[0].contribution !== passbook.openingContribution
  ) {
    throw new Error("Opening contribution mismatch.");
  }

  /**
   * Transaction count.
   *
   * Excludes opening entry.
   */
  if (contributionCount > 0) {
    contributionCount--;
  }

  if (contributionCount !== passbook.contributionCount) {
    throw new Error("Contribution count mismatch.");
  }
}
