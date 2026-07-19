/**
 * Opening balance carried
 * forward for a member.
 */
export type MemberOpeningBalance = {
  memberId: string;

  contribution: number;

  loan: number;

  specialLoan: number;

  specialLoanExpiry: Date | null;
};
