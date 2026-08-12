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

type LoadRepaymentsForMembersInput = {
  memberIds: string[];
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

  return collectRepaymentsFromMeetings(meetings, memberId.toString());
}

function collectRepaymentsFromMeetings(
  meetings: MeetingRepaymentDocument[],
  memberId: string,
): LoanRepayment[] {
  const repayments: LoanRepayment[] = [];

  for (const meeting of meetings) {
    const payment = meeting.payments.find(
      (item) => item.memberId.toString() === memberId,
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

/**
 * Loads loan repayments for multiple members
 * in a single query.
 */
export async function loadRepaymentsForMembers({
  memberIds,
}: LoadRepaymentsForMembersInput): Promise<Map<string, LoanRepayment[]>> {
  const uniqueMemberIds = [...new Set(memberIds)];

  const repaymentsByMember = new Map<string, LoanRepayment[]>(
    uniqueMemberIds.map((memberId) => [memberId, []]),
  );

  if (uniqueMemberIds.length === 0) {
    return repaymentsByMember;
  }

  const memberObjectIds = uniqueMemberIds.map((memberId) => new Types.ObjectId(memberId));

  const meetings = (await Meeting.find({
    payments: {
      $elemMatch: {
        memberId: { $in: memberObjectIds },
        loanRepayment: { $gt: 0 },
      },
    },
  })
    .select({
      meetingDate: 1,
      payments: 1,
    })
    .sort({
      meetingDate: 1,
    })
    .lean()) as unknown as MeetingRepaymentDocument[];

  for (const memberId of uniqueMemberIds) {
    repaymentsByMember.set(
      memberId,
      collectRepaymentsFromMeetings(meetings, memberId),
    );
  }

  return repaymentsByMember;
}
