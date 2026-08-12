/**
 * Opening balance carried
 * forward for a member.
 */
export type MemberOpeningBalance = {
  memberId: string;
  memberCode: string;
  memberName: string;

  savings: number;
  loanOutstanding: number;
  fineOutstanding: number;
  shareCapital: number;
  interestReceivable: number;
};
