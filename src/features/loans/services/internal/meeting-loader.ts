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
  financialYearId?: {
    toString(): string;
  };
};

type LoadRepaymentsForMembersInput = {
  memberIds: string[];
  financialYearId?: string;
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

function financialYearObjectId(financialYearId?: { toString(): string } | string) {
  if (!financialYearId) {
    return undefined;
  }

  return new Types.ObjectId(financialYearId.toString());
}

/**
 * Loads all loan repayments for a member.
 *
 * Repayments are returned in meeting
 * date order.
 */
export async function loadLoanRepayments({
  memberId,
  financialYearId,
}: LoadLoanRepaymentsInput): Promise<LoanRepayment[]> {
  const memberObjectId = new Types.ObjectId(memberId.toString());
  const yearId = financialYearObjectId(financialYearId);

  const meetings = (await Meeting.aggregate([
    {
      $match: {
        ...(yearId ? { financialYearId: yearId } : {}),
        payments: {
          $elemMatch: {
            memberId: memberObjectId,
            loanRepayment: { $gt: 0 },
          },
        },
      },
    },
    {
      $sort: {
        meetingDate: 1,
      },
    },
    {
      $project: {
        meetingDate: 1,
        payments: {
          $filter: {
            input: "$payments",
            as: "payment",
            cond: {
              $and: [
                { $eq: ["$$payment.memberId", memberObjectId] },
                { $gt: ["$$payment.loanRepayment", 0] },
              ],
            },
          },
        },
      },
    },
  ])) as MeetingRepaymentDocument[];

  return collectRepaymentsFromMeetings(meetings, memberId.toString());
}

function collectRepaymentsFromMeetings(
  meetings: MeetingRepaymentDocument[],
  memberId: string,
): LoanRepayment[] {
  const repayments: LoanRepayment[] = [];

  for (const meeting of meetings) {
    const payment = meeting.payments.find((item) => item.memberId.toString() === memberId);

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
  financialYearId,
}: LoadRepaymentsForMembersInput): Promise<Map<string, LoanRepayment[]>> {
  const uniqueMemberIds = [...new Set(memberIds)];

  const repaymentsByMember = new Map<string, LoanRepayment[]>(
    uniqueMemberIds.map((memberId) => [memberId, []]),
  );

  if (uniqueMemberIds.length === 0) {
    return repaymentsByMember;
  }

  const memberObjectIds = uniqueMemberIds.map((memberId) => new Types.ObjectId(memberId));
  const yearId = financialYearObjectId(financialYearId);

  const meetings = (await Meeting.aggregate([
    {
      $match: {
        ...(yearId ? { financialYearId: yearId } : {}),
        payments: {
          $elemMatch: {
            memberId: { $in: memberObjectIds },
            loanRepayment: { $gt: 0 },
          },
        },
      },
    },
    {
      $sort: {
        meetingDate: 1,
      },
    },
    {
      $project: {
        meetingDate: 1,
        payments: {
          $filter: {
            input: "$payments",
            as: "payment",
            cond: {
              $and: [
                { $in: ["$$payment.memberId", memberObjectIds] },
                { $gt: ["$$payment.loanRepayment", 0] },
              ],
            },
          },
        },
      },
    },
  ])) as MeetingRepaymentDocument[];

  for (const memberId of uniqueMemberIds) {
    repaymentsByMember.set(memberId, collectRepaymentsFromMeetings(meetings, memberId));
  }

  return repaymentsByMember;
}
