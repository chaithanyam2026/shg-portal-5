import { Types } from "mongoose";
/**
 * Closing balance of a member
 * at the end of a financial year.
 */
export type MemberClosingBalance = {
 memberId: Types.ObjectId;

  memberCode: string;

  memberName: string;

  savingsBalance: number;

  loanOutstanding: number;

  specialLoanOutstanding: number;

  attendanceFineOutstanding: number;

  loanFineOutstanding: number;

  totalOutstanding: number;
};
