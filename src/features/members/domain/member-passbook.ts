import type { MemberPassbookEntryType } from "./passbook-entry-type";

/**
 * Single contribution transaction.
 */
export type MemberPassbookEntry = {
  /**
   * Transaction date.
   */
  transactionDate: Date;

  /**
   * Entry type.
   */
  type: MemberPassbookEntryType;

  /**
   * Meeting reference.
   *
   * Undefined for opening contribution.
   */
  meetingId?: string;

  /**
   * Description shown in passbook.
   */
  description: string;

  /**
   * Contribution received.
   */
  contribution: number;

  /**
   * Running contribution balance.
   */
  runningBalance: number;
};

/**
 * Member contribution passbook.
 */
export type MemberPassbook = {
  /**
   * Member Id.
   */
  memberId: string;

  /**
   * Member Code.
   */
  memberCode: string;

  /**
   * Member Name.
   */
  memberName: string;

  /**
   * Financial Year.
   */
  financialYearId: string;

  financialYearName: string;

  /**
   * Opening contribution.
   */
  openingContribution: number;

  /**
   * Total contribution from
   * weekly meetings.
   */
  meetingContribution: number;

  /**
   * Current contribution balance.
   */
  currentBalance: number;

  /**
   * Number of contribution
   * transactions excluding the
   * opening contribution.
   */
  contributionCount: number;

  /**
   * Last contribution date.
   */
  lastContributionDate?: Date;

  /**
   * Ledger entries.
   */
  entries: MemberPassbookEntry[];
};
