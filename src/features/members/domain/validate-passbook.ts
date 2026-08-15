import type { MemberPassbook } from "./member-passbook";
import { isOpeningContributionEntry } from "./passbook-entry-type";

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
  if (passbook.openingContribution > 0) {
    if (
      passbook.entries.length === 0 ||
      !isOpeningContributionEntry(passbook.entries[0].type) ||
      passbook.entries[0].contribution !== passbook.openingContribution
    ) {
      throw new Error("Opening contribution mismatch.");
    }
  }

  /**
   * Transaction count.
   *
   * Excludes opening entry.
   */
  const weeklyContributionCount = passbook.entries.filter(
    (entry) => !isOpeningContributionEntry(entry.type),
  ).length;

  if (weeklyContributionCount !== passbook.contributionCount) {
    throw new Error("Contribution count mismatch.");
  }
}
