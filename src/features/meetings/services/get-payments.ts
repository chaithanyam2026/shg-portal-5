import connectMongo from "@/lib/db/mongodb";

import Meeting from "@/models/Meeting";
import Member from "@/models/Member";

import { WEEKLY_CONTRIBUTION } from "../domain/payment";

import type {
  PaymentRecord,
  PaymentSummary,
} from "../types";

function createSummary(
  meetingId: string,
  status: PaymentSummary["status"],
  records: PaymentRecord[],
): PaymentSummary {
  const totalContribution = records.reduce(
    (sum, record) => sum + record.contribution,
    0,
  );

  const totalLoanRepayment = records.reduce(
    (sum, record) => sum + record.loanRepayment,
    0,
  );

  const totalAbsentFine = records.reduce(
    (sum, record) => sum + record.absentFine,
    0,
  );

  const totalSpecialLoanFine = records.reduce(
    (sum, record) => sum + record.specialLoanFine,
    0,
  );

  return {
    meetingId,

    status,

    records,

    totalContribution,

    totalLoanRepayment,

    totalAbsentFine,

    totalSpecialLoanFine,

    grandTotal:
      totalContribution +
      totalLoanRepayment +
      totalAbsentFine +
      totalSpecialLoanFine,
  };
}

export async function getPayments(
  meetingId: string,
): Promise<PaymentSummary> {
  await connectMongo();

  const meeting = await Meeting.findById(
    meetingId,
  ).lean();

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  const payments =
    meeting.payments ?? [];

  if (payments.length === 0) {
    const members = await Member.find({
      active: true,
    })
      .sort({
        memberCode: 1,
      })
      .lean();

    const records: PaymentRecord[] =
      members.map((member) => ({
        memberId:
          member._id.toString(),

        memberCode:
          member.memberCode,

        memberName:
          member.name,

        contribution: 0,

        loanRepayment: 0,

        absentFine: 0,

        specialLoanFine: 0,

        remarks: "",

        total:0
      }));

    return createSummary(
      meetingId,
      meeting.status,
      records,
    );
  }

  const members = await Member.find({
    _id: {
      $in: payments.map(
        (payment) =>
          payment.memberId,
      ),
    },
  }).lean();

  const memberMap = new Map(
    members.map((member) => [
      member._id.toString(),
      member,
    ]),
  );

  const records: PaymentRecord[] =
    payments.map((payment) => {
      const member =
        memberMap.get(
          payment.memberId.toString(),
        );

      const total =
        payment.contribution +
        payment.loanRepayment +
        payment.absentFine +
        payment.specialLoanFine;

      return {
        memberId:
          payment.memberId.toString(),

        memberCode:
          member?.memberCode ?? "",

        memberName:
          member?.name ?? "",

        contribution:
          payment.contribution,

        loanRepayment:
          payment.loanRepayment,

        absentFine:
          payment.absentFine,

        specialLoanFine:
          payment.specialLoanFine,

        remarks:
          payment.remarks,

        total,
      };
    });

  return createSummary(
    meetingId,
    meeting.status,
    records,
  );
}