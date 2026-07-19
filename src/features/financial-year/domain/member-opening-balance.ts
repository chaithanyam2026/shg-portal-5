/**
 * Opening balance carried
 * forward for a member.
 */
export type MemberOpeningBalance = {
  memberId: string;

  memberCode: string;

  memberName: string;

  savings: number;

  loan: number;

  interest: number;

  fine: number;

  other: number;
};
