import Meeting from "@/models/Meeting";
import { Types } from "mongoose";

export type LoanRepayment = {
  meetingId: string;

  meetingDate: Date;

  amountPaid: number;
};

type LoadLoanRepaymentsInput = {
  memberId: {
    toString(): string;
  };
};

type MeetingRepaymentDocument = {
  _id: {
    toString(): string;
  };
  meetingDate: Date;
  payments: Array<{
    memberId: {
      toString(): string;
    };
    loanRepayment: number;
  }>;
};

/**
 * Loads all loan repayments for a member.
 *
 * Repayments are returned in meeting
 * date order.
 */
export async function loadLoanRepayments({
  memberId,
}: LoadLoanRepaymentsInput): Promise<LoanRepayment[]> {
  const memberObjectId = new Types.ObjectId(memberId.toString());

  const meetings = (await Meeting.find()
    .where("payments.memberId")
    .equals(memberObjectId)
    .select({
      meetingDate: 1,
      payments: 1,
    })
    .sort({
      meetingDate: 1,
    })
    .lean()) as unknown as MeetingRepaymentDocument[];

  const repayments: LoanRepayment[] = [];

  for (const meeting of meetings) {
    const payment = meeting.payments.find(
      (item) => item.memberId.toString() === memberId.toString(),
    );

    if (!payment || payment.loanRepayment <= 0) {
      continue;
    }

    repayments.push({
      meetingId: meeting._id.toString(),

      meetingDate: meeting.meetingDate,

      amountPaid: payment.loanRepayment,
    });
  }

  return repayments;
}
