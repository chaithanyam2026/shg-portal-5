import {
  MemberPassbook,
  MemberPassbookEntry,
  OPENING_CONTRIBUTION_ENTRY,
  validateMemberPassbook,
  WEEKLY_CONTRIBUTION_ENTRY,
} from "../../domain";

type MeetingContribution = {
  _id: unknown;

  meetingDate: Date;

  payments: {
    memberId: unknown;

    contribution: number;
  }[];
};

type BuildMemberPassbookInput = {
  memberId: string;

  memberCode: string;

  memberName: string;

  financialYearId: string;

  financialYearName: string;

  startDate: Date;

  openingContribution: number;

  meetings: MeetingContribution[];
};

/**
 * Builds the member contribution
 * passbook.
 *
 * Entries:
 *
 * • Opening Contribution
 * • Weekly Contributions
 */
export function buildMemberPassbook({
  memberId,
  memberCode,
  memberName,
  financialYearId,
  financialYearName,
  startDate,
  openingContribution,
  meetings,
}: BuildMemberPassbookInput): MemberPassbook {
  const entries: MemberPassbookEntry[] = [];

  let balance = 0;

  let meetingContribution = 0;

  let contributionCount = 0;

  let lastContributionDate: Date | undefined;

  /**
   * Opening contribution.
   */
  if (openingContribution > 0) {
    balance += openingContribution;

    entries.push({
      transactionDate: startDate,

      type: OPENING_CONTRIBUTION_ENTRY,

      description: "Opening Contribution",

      contribution: openingContribution,

      runningBalance: balance,
    });
  }

  /**
   * Weekly meeting contributions.
   */
  const sortedMeetings = [...meetings].sort(
    (a, b) => a.meetingDate.getTime() - b.meetingDate.getTime(),
  );

  for (const meeting of sortedMeetings) {
    const payment = meeting.payments.find((payment) => payment.memberId.toString() === memberId);

    if (!payment || payment.contribution <= 0) {
      continue;
    }

    balance += payment.contribution;

    meetingContribution += payment.contribution;

    contributionCount++;

    lastContributionDate = meeting.meetingDate;

    entries.push({
      transactionDate: meeting.meetingDate,

      type: WEEKLY_CONTRIBUTION_ENTRY,

      meetingId: meeting._id.toString(),

      description: "Weekly Contribution",

      contribution: payment.contribution,

      runningBalance: balance,
    });
  }

  const passbook = {
    memberId,

    memberCode,

    memberName,

    financialYearId,

    financialYearName,

    openingContribution,

    meetingContribution,

    currentBalance: balance,

    contributionCount,

    lastContributionDate,

    entries,
  };

  validateMemberPassbook(passbook);

  return passbook;
}
